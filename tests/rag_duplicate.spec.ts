import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test'
import path from 'path'

test.describe('RAG Endpoint Duplicate Tests', () => {
	let browserContext: BrowserContext
	let page: Page
	let extensionId: string

	test.beforeAll(async () => {
		const __dirname = path.dirname(new URL(import.meta.url).pathname)
		const pathToExtension = path.join(__dirname, '../dist')
		const userDataDir = `/tmp/test-user-data-dir-${Date.now()}`

		console.log(`Loading extension from: ${pathToExtension}`)

		browserContext = await chromium.launchPersistentContext(userDataDir, {
			headless: false,
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		})

		// Wait for service worker to be ready
		let serviceWorker = browserContext.serviceWorkers()[0]
		if (!serviceWorker) {
			serviceWorker = await browserContext.waitForEvent('serviceworker')
		}

		// Extract extension ID from service worker URL
		const urlParts = serviceWorker.url().split('/')
		extensionId = urlParts[2]
		console.log(`Extension ID: ${extensionId}`)
	})

	test.afterAll(async () => {
		await browserContext.close()
	})

	async function initializeExtension(page: Page) {
		await page.goto(`chrome-extension://${extensionId}/popup.html`)
		await expect(page.locator('body')).toBeVisible()

		// Handle Introduction if present
		const introButton = page.getByTestId('intro-lets-go-btn')
		if (await introButton.isVisible()) {
			await introButton.click()
		}

		// Configure Endpoint if needed (required to see the main screen)
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn')
		if (await newEndpointBtn.isVisible()) {
			await newEndpointBtn.click()

			await page.getByTestId('endpoint-title-input').fill('Test Endpoint')
			await page.getByTestId('endpoint-url-input').fill('https://example.com/v1/chat/completions')
			await page.getByTestId('endpoint-model-input').fill('gpt-3.5-turbo')
			await page.getByTestId('endpoint-apikey-input').fill('sk-test-key')
			await page.getByTestId('endpoint-add-btn').click()
		}
	}

	test('Prevent Duplicate RAG Endpoint Titles', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// 1. Navigate to RAG Configuration
		const ragConfigBtn = page.getByTestId('rag-config-btn')

		if (!(await ragConfigBtn.isVisible({ timeout: 1000 }).catch(() => false))) {
			const connectionAccordion = page.getByTestId('connection-accordion-toggle')
			await expect(connectionAccordion).toBeVisible()
			await connectionAccordion.click()
		}

		// Wait for RAG config button
		await expect(ragConfigBtn).toBeVisible()
		await ragConfigBtn.click()

		// 2. Add first RAG endpoint
		const addRagBtn = page.getByTestId('rag-endpoint-add-btn')
		await expect(addRagBtn).toBeVisible()
		await addRagBtn.click()

		await page.getByTestId('rag-endpoint-title-input').fill('Duplicate Test')
		await page.getByTestId('rag-endpoint-url-input').fill('https://example.com/rag1')
		await page.getByTestId('rag-endpoint-submit-btn').click()

		// Verify it was added
		// Use a more specific locator to avoid strict mode violation (Connection component also lists endpoints)
		const listItem = page.locator('li.endpoint-item span').getByText('Duplicate Test')
		await expect(listItem).toBeVisible()

		// 3. Try to add duplicate
		await addRagBtn.click()
		await page.getByTestId('rag-endpoint-title-input').fill('Duplicate Test')
		await page.getByTestId('rag-endpoint-url-input').fill('https://example.com/rag2')
		await page.getByTestId('rag-endpoint-submit-btn').click()

		// 4. Expect error message
		const errorMsg = page.getByTestId('rag-endpoint-error-msg')
		await expect(errorMsg).toBeVisible()
		// We can check text content if we want, but visibility is enough for now

		// 5. Change title to be unique
		await page.getByTestId('rag-endpoint-title-input').fill('Unique Test')
		await page.getByTestId('rag-endpoint-submit-btn').click()

		// Verify success
		const uniqueListItem = page.locator('li.endpoint-item span').getByText('Unique Test')
		await expect(uniqueListItem).toBeVisible()
		await expect(errorMsg).toBeHidden()

		// 6. Edit "Unique Test" and try to rename to "Duplicate Test"
		// Need to find the edit button for "Unique Test".
		// In RagEndpointList, the structure is:
		// li -> span(title) -> div -> EditIcon
		// This is tricky without a specific test id for the row.
		// But since we added "Unique Test" last, it might be the last one?
		// Or we can use locator filtering.

		const uniqueTestRow = page.locator('li.endpoint-item').filter({ hasText: 'Unique Test' })
		const editBtn = uniqueTestRow.locator('svg').nth(1) // Copy, Edit, Remove. Edit is 2nd (index 1)
		// Or better, I should have added test-id to the edit button.
		// Let's assume the order is Copy, Edit, Remove.

		// Actually, let's verify if I can click it.
		await editBtn.click()

		// 7. Try to rename to "Duplicate Test"
		await page.getByTestId('rag-endpoint-title-input').fill('Duplicate Test')
		await page.getByTestId('rag-endpoint-submit-btn').click()

		// 8. Expect error
		await expect(errorMsg).toBeVisible()

		// 9. Rename to self (no change) should work
		await page.getByTestId('rag-endpoint-title-input').fill('Unique Test')
		await page.getByTestId('rag-endpoint-submit-btn').click()

		await expect(errorMsg).toBeHidden()
		await expect(uniqueListItem).toBeVisible()
	})
})
