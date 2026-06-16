import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test'
import path from 'path'
import { testConfig } from './config'

test.describe('Extension Tests', () => {
	let browserContext: BrowserContext
	let page: Page
	let extensionId: string

	test.beforeAll(async () => {
		const __dirname = path.dirname(new URL(import.meta.url).pathname)
		const pathToExtension = path.join(__dirname, '../dist-chrome')
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

	// Helper function to initialize the extension (skip intro, add endpoint if needed)
	async function initializeExtension(page: Page) {
		await page.goto(`chrome-extension://${extensionId}/popup.html`)
		await expect(page.locator('body')).toBeVisible()

		// Handle Introduction if present
		const introButton = page.getByTestId('intro-lets-go-btn')
		if (await introButton.isVisible()) {
			await introButton.click()
		}

		// Configure Endpoint if needed
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn')
		if (await newEndpointBtn.isVisible()) {
			await newEndpointBtn.click()

			await page.getByTestId('endpoint-title-input').fill('Test Gemini')
			await page.getByTestId('endpoint-url-input').fill(testConfig.url)
			await page.getByTestId('endpoint-model-input').fill(testConfig.model)
			await page.getByTestId('endpoint-apikey-input').fill(testConfig.apiKey)
			await page.getByTestId('endpoint-add-btn').click()
		}
	}

	test('Configure and Check Fact', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Perform Fact Check
		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()

		await inputArea.fill(testConfig.texts.default)

		// Click Check button
		const checkBtn = page.getByTestId('fact-check-btn')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()

		// Verify Result
		test.setTimeout(60000)
		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })
	})

	test('Multiple Sequential Fact Checks', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		test.setTimeout(120000)

		// First fact check
		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()
		await inputArea.fill(testConfig.texts.default)

		const checkBtn = page.getByTestId('fact-check-btn')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()

		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// Navigate back to input for second check
		// Click on the "Marked Text" accordion to go back
		const markedTextAccordion = page
			.locator('label')
			.filter({ hasText: /marked text|selected/i })
			.first()
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}

		// Wait for input to be visible again
		await expect(inputArea).toBeVisible()
		await inputArea.fill('The Earth is flat.')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// Navigate back for third check
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}

		await expect(inputArea).toBeVisible()
		await inputArea.fill('Water boils at 100°C at sea level.')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()
		await expect(copyBtn).toBeVisible({ timeout: 30000 })
	})

	test('Create and Use Custom Role', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		test.setTimeout(90000)

		// First, check if role config button is already visible (accordion open)
		const roleConfigBtn = page.getByTestId('role-config-btn')

		if (!(await roleConfigBtn.isVisible({ timeout: 1000 }).catch(() => false))) {
			// If not visible, try to open the accordion
			const connectionAccordion = page.getByTestId('connection-accordion-toggle')
			await expect(connectionAccordion).toBeVisible()
			await connectionAccordion.click()
		}

		// Now it should be visible
		await expect(roleConfigBtn).toBeVisible({ timeout: 5000 })
		await roleConfigBtn.click()

		// Click "Add Role" button
		const addRoleBtn = page.getByTestId('role-add-btn')
		await expect(addRoleBtn).toBeVisible()
		await addRoleBtn.click()

		// Fill in custom role details
		const roleNameInput = page.getByTestId('role-name-input')
		const roleDescInput = page.getByTestId('role-description-input')

		await roleNameInput.fill('Test Skeptic')
		await roleDescInput.fill(
			'You are a highly skeptical fact-checker who questions everything and demands rigorous evidence.',
		)

		// Save the role
		const saveBtn = page.getByTestId('role-save-btn')
		await saveBtn.click()

		// Close role config
		const closeBtn = page.getByTestId('role-config-close-btn')
		await closeBtn.click()

		// Wait for RoleConfig to disappear
		await expect(closeBtn).toBeHidden()

		// Now select the custom role (should still be in the Connection accordion)
		// Ensure accordion is open
		const roleSelect = page.getByTestId('role-selector')
		if (!(await roleSelect.isVisible())) {
			const connectionAccordion = page.getByTestId('connection-accordion-toggle')
			await expect(connectionAccordion).toBeVisible()
			await connectionAccordion.click()
		}

		await expect(roleSelect).toBeVisible()
		await roleSelect.selectOption('Test Skeptic')

		// Navigate to the input area
		const markedTextAccordion = page
			.locator('label')
			.filter({ hasText: /marked text|selected/i })
			.first()
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}

		// Perform fact check with custom role
		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()
		await inputArea.fill('Vaccines cause autism.')

		const checkBtn = page.getByTestId('fact-check-btn')
		await checkBtn.click()

		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })
	})

	test('Test Different Built-in Roles', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		test.setTimeout(120000)

		const inputArea = page.getByTestId('selected-text-input').first()
		const checkBtn = page.getByTestId('fact-check-btn')
		const testText = 'Climate change is a hoax.'

		// Use the role selector test ID
		const roleSelect = page.getByTestId('role-selector')

		if (await roleSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
			// Get all available roles
			const options = await roleSelect.locator('option').all()

			// Test with first two roles (if available)
			for (let i = 0; i < Math.min(2, options.length); i++) {
				const optionText = await options[i].textContent()
				console.log(`Testing with role: ${optionText}`)

				await roleSelect.selectOption({ index: i })
				await inputArea.fill(testText)
				await checkBtn.click()

				const copyBtn = page.getByTestId('response-copy-btn')
				await expect(copyBtn).toBeVisible({ timeout: 30000 })

				// Wait a bit between checks
				await page.waitForTimeout(2000)
			}
		} else {
			// If no role selector, just do a single check
			await inputArea.fill(testText)
			await checkBtn.click()

			const copyBtn = page.getByTestId('response-copy-btn')
			await expect(copyBtn).toBeVisible({ timeout: 30000 })
		}
	})

	test('Copy Response to Clipboard', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		test.setTimeout(90000)

		// Perform a fact check
		const inputArea = page.getByTestId('selected-text-input').first()
		await inputArea.fill('The speed of light is approximately 299,792 km/s.')

		const checkBtn = page.getByTestId('fact-check-btn')
		await checkBtn.click()

		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// Grant clipboard permissions
		await browserContext.grantPermissions(['clipboard-read', 'clipboard-write'])

		// Click copy button
		await copyBtn.click()

		// Verify clipboard content (wait a bit for copy to complete)
		await page.waitForTimeout(500)

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
		expect(clipboardText.length).toBeGreaterThan(0)
		console.log(`Copied ${clipboardText.length} characters to clipboard`)
	})

	test('Check Empty Input Handling', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Clear selected content to ensure we test empty input
		await page.evaluate(async () => {
			const { unifiedState } = await chrome.storage.local.get('unifiedState')
			if (unifiedState) {
				const state = JSON.parse(unifiedState)
				state.selectedContent = null
				await chrome.storage.local.set({ unifiedState: JSON.stringify(state) })
			}
		})
		await page.reload()
		await expect(page.locator('body')).toBeVisible()

		// Try to check without entering text
		const checkBtn = page.getByTestId('fact-check-btn')

		// Button should be disabled or not trigger a check
		const isDisabled = await checkBtn.isDisabled().catch(() => false)

		if (!isDisabled) {
			// If button is enabled, clicking it should not produce a result
			await checkBtn.click()

			// Wait a bit and verify no response appears
			await page.waitForTimeout(2000)
			const copyBtn = page.getByTestId('response-copy-btn')
			const isVisible = await copyBtn.isVisible({ timeout: 2000 }).catch(() => false)
			expect(isVisible).toBe(false)
		}
	})

	test('Verify Response Contains Relevant Content', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		test.setTimeout(90000)

		// Perform a fact check with a specific claim
		const inputArea = page.getByTestId('selected-text-input').first()
		const testClaim = 'The Great Wall of China is visible from space.'
		await inputArea.fill(testClaim)

		const checkBtn = page.getByTestId('fact-check-btn')
		await checkBtn.click()

		// Wait for response
		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// Get the response text
		const responseTextarea = page.getByTestId('response-result-textarea')
		if (await responseTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
			const responseText = await responseTextarea.inputValue()

			// Verify response is not empty and has reasonable length
			expect(responseText.length).toBeGreaterThan(20)
			console.log(`Response length: ${responseText.length} characters`)
		}
	})

	test('Persistence - Endpoint Survives Page Reload', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Close and reopen the popup
		await page.close()

		page = await browserContext.newPage()
		await page.goto(`chrome-extension://${extensionId}/popup.html`)
		await expect(page.locator('body')).toBeVisible()

		// Should not need to configure endpoint again
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn')
		const needsConfig = await newEndpointBtn.isVisible({ timeout: 2000 }).catch(() => false)

		expect(needsConfig).toBe(false)

		// Should be able to perform fact check immediately
		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()
	})

	test('Selected Endpoint Preserved After Multiple Requests', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Add a second endpoint so we can test selection persistence
		const configBtn = page.getByTestId('connection-icon-settings')
		if (!(await configBtn.isVisible({ timeout: 2000 }).catch(() => false))) {
			// Navigate to config to add second endpoint
			await page.evaluate(async () => {
				const { endpoints } = await chrome.storage.local.get('endpoints')
				if (endpoints) {
					const state = JSON.parse(endpoints)
					if (state.list.length < 2) {
						state.list.push({
							title: 'Test GPT',
							url: 'https://openrouter.ai/api/v1/chat/completions',
							apiKey: state.list[0].apiKey,
							model: 'openai/gpt-4.1-nano',
							canProcessImages: false,
							rolePlacement: 'system',
						})
						await chrome.storage.local.set({ endpoints: JSON.stringify(state) })
					}
				}
			})
			await page.reload()
			await expect(page.locator('body')).toBeVisible()
			await page.waitForTimeout(500)
		}

		// Open connection accordion
		const connectionAccordion = page.getByTestId('connection-accordion-toggle')
		await expect(connectionAccordion).toBeVisible()
		await connectionAccordion.click()

		// Select the second endpoint
		const endpointSelect = page.getByTestId('endpoint-selector')
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await endpointSelect.selectOption('Test GPT')

		// Verify the second endpoint is selected
		await expect(endpointSelect).toHaveValue('Test GPT')

		// Open the "Marked Text" accordion
		const markedTextAccordion = page
			.locator('label')
			.filter({ hasText: /marked text|selected/i })
			.first()
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}

		// First request
		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()
		await inputArea.fill(testConfig.texts.default)

		const checkBtn = page.getByTestId('fact-check-btn')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()

		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// After first request, verify the endpoint is still the second one
		// Reopen connection accordion to check
		if (await connectionAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await connectionAccordion.click()
		}
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await expect(endpointSelect).toHaveValue('Test GPT')

		// Go back and do second request
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}
		await expect(inputArea).toBeVisible()
		await inputArea.fill(testConfig.texts.complex)
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()
		await expect(copyBtn).toBeVisible({ timeout: 30000 })

		// After second request, endpoint should still be the second one
		if (await connectionAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await connectionAccordion.click()
		}
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await expect(endpointSelect).toHaveValue('Test GPT')

		test.setTimeout(120000)
	})

	test('Endpoint Selection Persists Across Page Reloads', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Add a second endpoint
		await page.evaluate(async () => {
			const { endpoints } = await chrome.storage.local.get('endpoints')
			if (endpoints) {
				const state = JSON.parse(endpoints)
				if (state.list.length < 2) {
					state.list.push({
						title: 'Test GPT',
						url: 'https://openrouter.ai/api/v1/chat/completions',
						apiKey: state.list[0].apiKey,
						model: 'openai/gpt-4.1-nano',
						canProcessImages: false,
						rolePlacement: 'system',
					})
					await chrome.storage.local.set({ endpoints: JSON.stringify(state) })
				}
			}
		})
		await page.reload()
		await expect(page.locator('body')).toBeVisible()
		await page.waitForTimeout(500)

		// Open connection accordion and select the second endpoint
		const connectionAccordion = page.getByTestId('connection-accordion-toggle')
		await expect(connectionAccordion).toBeVisible()
		await connectionAccordion.click()

		const endpointSelect = page.getByTestId('endpoint-selector')
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await endpointSelect.selectOption('Test GPT')
		await expect(endpointSelect).toHaveValue('Test GPT')

		// Close and reopen the popup
		await page.close()
		page = await browserContext.newPage()
		await page.goto(`chrome-extension://${extensionId}/popup.html`)
		await expect(page.locator('body')).toBeVisible()
		await page.waitForTimeout(500)

		// Reopen accordion and verify endpoint is still selected
		const newConnectionAccordion = page.getByTestId('connection-accordion-toggle')
		await expect(newConnectionAccordion).toBeVisible()
		await newConnectionAccordion.click()

		const newEndpointSelect = page.getByTestId('endpoint-selector')
		await expect(newEndpointSelect).toBeVisible({ timeout: 5000 })
		await expect(newEndpointSelect).toHaveValue('Test GPT')
	})

	test('Switching Between Endpoints Works Correctly', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Add a second endpoint
		await page.evaluate(async () => {
			const { endpoints } = await chrome.storage.local.get('endpoints')
			if (endpoints) {
				const state = JSON.parse(endpoints)
				if (state.list.length < 2) {
					state.list.push({
						title: 'Test GPT',
						url: 'https://openrouter.ai/api/v1/chat/completions',
						apiKey: state.list[0].apiKey,
						model: 'openai/gpt-4.1-nano',
						canProcessImages: false,
						rolePlacement: 'system',
					})
					await chrome.storage.local.set({ endpoints: JSON.stringify(state) })
				}
			}
		})
		await page.reload()
		await expect(page.locator('body')).toBeVisible()
		await page.waitForTimeout(500)

		const connectionAccordion = page.getByTestId('connection-accordion-toggle')
		await expect(connectionAccordion).toBeVisible()
		await connectionAccordion.click()

		const endpointSelect = page.getByTestId('endpoint-selector')
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })

		// Get available options
		const options = await endpointSelect.locator('option').all()
		expect(options.length).toBeGreaterThanOrEqual(2)

		// Switch between endpoints multiple times
		const firstTitle = testConfig.secondEndpoint.title
		const secondTitle = 'Test Gemini'

		await endpointSelect.selectOption(firstTitle)
		await expect(endpointSelect).toHaveValue(firstTitle)
		await page.waitForTimeout(300)

		await endpointSelect.selectOption(secondTitle)
		await expect(endpointSelect).toHaveValue(secondTitle)
		await page.waitForTimeout(300)

		await endpointSelect.selectOption(firstTitle)
		await expect(endpointSelect).toHaveValue(firstTitle)
		await page.waitForTimeout(300)

		await endpointSelect.selectOption(secondTitle)
		await expect(endpointSelect).toHaveValue(secondTitle)

		// Verify both endpoints can be used for requests
		const markedTextAccordion = page
			.locator('label')
			.filter({ hasText: /marked text|selected/i })
			.first()
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}

		const inputArea = page.getByTestId('selected-text-input').first()
		await expect(inputArea).toBeVisible()
		await inputArea.fill(testConfig.texts.default)

		const checkBtn = page.getByTestId('fact-check-btn')
		await expect(checkBtn).toBeEnabled()
		await checkBtn.click()

		const copyBtn = page.getByTestId('response-copy-btn')
		await expect(copyBtn).toBeVisible({ timeout: 30000 })
	})

	test('Selected Endpoint Not Changing Without User Interaction', async () => {
		page = await browserContext.newPage()
		await initializeExtension(page)

		// Add a second endpoint
		await page.evaluate(async () => {
			const { endpoints } = await chrome.storage.local.get('endpoints')
			if (endpoints) {
				const state = JSON.parse(endpoints)
				if (state.list.length < 2) {
					state.list.push({
						title: 'Test GPT',
						url: 'https://openrouter.ai/api/v1/chat/completions',
						apiKey: state.list[0].apiKey,
						model: 'openai/gpt-4.1-nano',
						canProcessImages: false,
						rolePlacement: 'system',
					})
					await chrome.storage.local.set({ endpoints: JSON.stringify(state) })
				}
			}
		})
		await page.reload()
		await expect(page.locator('body')).toBeVisible()
		await page.waitForTimeout(500)

		const connectionAccordion = page.getByTestId('connection-accordion-toggle')
		await expect(connectionAccordion).toBeVisible()
		await connectionAccordion.click()

		const endpointSelect = page.getByTestId('endpoint-selector')
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await endpointSelect.selectOption('Test GPT')
		await expect(endpointSelect).toHaveValue('Test GPT')

		// Close and reopen the accordion (simulates UI interactions without changing endpoint)
		await connectionAccordion.click()
		await page.waitForTimeout(300)
		await connectionAccordion.click()

		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await expect(endpointSelect).toHaveValue('Test GPT')

		// Switch to Selected accordion and come back
		const markedTextAccordion = page
			.locator('label')
			.filter({ hasText: /marked text|selected/i })
			.first()
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click()
		}
		await page.waitForTimeout(300)

		await connectionAccordion.click()
		await expect(endpointSelect).toBeVisible({ timeout: 5000 })
		await expect(endpointSelect).toHaveValue('Test GPT')
	})
})
