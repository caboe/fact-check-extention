import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import { testConfig } from './config';

test.describe('Extension Tests', () => {
	let browserContext: BrowserContext;
	let page: Page;
	let extensionId: string;

	test.beforeAll(async () => {
		const __dirname = path.dirname(new URL(import.meta.url).pathname);
		const pathToExtension = path.join(__dirname, '../dist');
		const userDataDir = `/tmp/test-user-data-dir-${Date.now()}`;

		console.log(`Loading extension from: ${pathToExtension}`);

		browserContext = await chromium.launchPersistentContext(userDataDir, {
			headless: false,
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		});

		// Wait for service worker to be ready
		let serviceWorker = browserContext.serviceWorkers()[0];
		if (!serviceWorker) {
			serviceWorker = await browserContext.waitForEvent('serviceworker');
		}

		// Extract extension ID from service worker URL
		const urlParts = serviceWorker.url().split('/');
		extensionId = urlParts[2];
		console.log(`Extension ID: ${extensionId}`);
	});

	test.afterAll(async () => {
		await browserContext.close();
	});

	test('Configure and Check Fact', async () => {
		page = await browserContext.newPage();
		await page.goto(`chrome-extension://${extensionId}/popup.html`);

		// Wait for the app to load
		await expect(page.locator('body')).toBeVisible();

		// 1. Handle Introduction if present
		const introButton = page.getByTestId('intro-lets-go-btn');
		if (await introButton.isVisible()) {
			await introButton.click();
		}

		// 2. Configure Endpoint if needed
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn');
		
		// If we see the "New Endpoint" button, we need to add one.
		if (await newEndpointBtn.isVisible()) {
			await newEndpointBtn.click();
			
			// Fill the form
			await page.getByTestId('endpoint-title-input').fill('Test Gemini');
			await page.getByTestId('endpoint-url-input').fill(testConfig.url);
			await page.getByTestId('endpoint-model-input').fill(testConfig.model);
			await page.getByTestId('endpoint-apikey-input').fill(testConfig.apiKey);

			// Click Add
			await page.getByTestId('endpoint-add-btn').click();
		}

		// 3. Perform Fact Check
		const inputArea = page.getByTestId('selected-text-input').first();
		await expect(inputArea).toBeVisible();
		
		await inputArea.fill(testConfig.texts.default);

		// Click Check button
		const checkBtn = page.getByTestId('fact-check-btn');
		await expect(checkBtn).toBeEnabled();
		await checkBtn.click();

		// 4. Verify Result
		test.setTimeout(60000);

		const copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });
	});
});
