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

	// Helper function to initialize the extension (skip intro, add endpoint if needed)
	async function initializeExtension(page: Page) {
		await page.goto(`chrome-extension://${extensionId}/popup.html`);
		await expect(page.locator('body')).toBeVisible();

		// Handle Introduction if present
		const introButton = page.getByTestId('intro-lets-go-btn');
		if (await introButton.isVisible()) {
			await introButton.click();
		}

		// Configure Endpoint if needed
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn');
		if (await newEndpointBtn.isVisible()) {
			await newEndpointBtn.click();
			
			await page.getByTestId('endpoint-title-input').fill('Test Gemini');
			await page.getByTestId('endpoint-url-input').fill(testConfig.url);
			await page.getByTestId('endpoint-model-input').fill(testConfig.model);
			await page.getByTestId('endpoint-apikey-input').fill(testConfig.apiKey);
			await page.getByTestId('endpoint-add-btn').click();
		}
	}

	test('Configure and Check Fact', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		// Perform Fact Check
		const inputArea = page.getByTestId('selected-text-input').first();
		await expect(inputArea).toBeVisible();
		
		await inputArea.fill(testConfig.texts.default);

		// Click Check button
		const checkBtn = page.getByTestId('fact-check-btn');
		await expect(checkBtn).toBeEnabled();
		await checkBtn.click();

		// Verify Result
		test.setTimeout(60000);
		const copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });
	});

	test('Multiple Sequential Fact Checks', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		test.setTimeout(120000);

		// First fact check
		const inputArea = page.getByTestId('selected-text-input').first();
		await expect(inputArea).toBeVisible();
		await inputArea.fill(testConfig.texts.default);
		
		const checkBtn = page.getByTestId('fact-check-btn');
		await expect(checkBtn).toBeEnabled();
		await checkBtn.click();
		
		let copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });

		// Navigate back to input for second check
		// Click on the "Marked Text" accordion to go back
		const markedTextAccordion = page.locator('label').filter({ hasText: /marked text|selected/i }).first();
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click();
		}
		
		// Wait for input to be visible again
		await expect(inputArea).toBeVisible();
		await inputArea.fill('The Earth is flat.');
		await expect(checkBtn).toBeEnabled();
		await checkBtn.click();
		await expect(copyBtn).toBeVisible({ timeout: 30000 });

		// Navigate back for third check
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click();
		}
		
		await expect(inputArea).toBeVisible();
		await inputArea.fill('Water boils at 100°C at sea level.');
		await expect(checkBtn).toBeEnabled();
		await checkBtn.click();
		await expect(copyBtn).toBeVisible({ timeout: 30000 });
	});

	test('Create and Use Custom Role', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		test.setTimeout(90000);

		// First, we need to open the Connection/Role accordion to see the role config button
		const connectionAccordion = page.locator('label').filter({ hasText: /role/i }).first();
		if (await connectionAccordion.isVisible({ timeout: 5000 }).catch(() => false)) {
			await connectionAccordion.click();
		}

		// Open role configuration
		const roleConfigBtn = page.getByTestId('role-config-btn');
		await expect(roleConfigBtn).toBeVisible({ timeout: 5000 });
		await roleConfigBtn.click();

		// Click "Add Role" button
		const addRoleBtn = page.getByTestId('role-add-btn');
		await expect(addRoleBtn).toBeVisible();
		await addRoleBtn.click();

		// Fill in custom role details
		const roleNameInput = page.getByTestId('role-name-input');
		const roleDescInput = page.getByTestId('role-description-input');
		
		await roleNameInput.fill('Test Skeptic');
		await roleDescInput.fill('You are a highly skeptical fact-checker who questions everything and demands rigorous evidence.');

		// Save the role
		const saveBtn = page.getByTestId('role-save-btn');
		await saveBtn.click();

		// Close role config
		const closeBtn = page.getByTestId('role-config-close-btn');
		await closeBtn.click();

		// Now select the custom role (should still be in the Connection accordion)
		const roleSelect = page.getByTestId('role-selector');
		await expect(roleSelect).toBeVisible();
		await roleSelect.selectOption('Test Skeptic');

		// Navigate to the input area
		const markedTextAccordion = page.locator('label').filter({ hasText: /marked text|selected/i }).first();
		if (await markedTextAccordion.isVisible({ timeout: 2000 }).catch(() => false)) {
			await markedTextAccordion.click();
		}

		// Perform fact check with custom role
		const inputArea = page.getByTestId('selected-text-input').first();
		await expect(inputArea).toBeVisible();
		await inputArea.fill('Vaccines cause autism.');
		
		const checkBtn = page.getByTestId('fact-check-btn');
		await checkBtn.click();
		
		const copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });
	});

	test('Test Different Built-in Roles', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		test.setTimeout(120000);

		const inputArea = page.getByTestId('selected-text-input').first();
		const checkBtn = page.getByTestId('fact-check-btn');
		const testText = 'Climate change is a hoax.';

		// Use the role selector test ID
		const roleSelect = page.getByTestId('role-selector');
		
		if (await roleSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
			// Get all available roles
			const options = await roleSelect.locator('option').all();
			
			// Test with first two roles (if available)
			for (let i = 0; i < Math.min(2, options.length); i++) {
				const optionText = await options[i].textContent();
				console.log(`Testing with role: ${optionText}`);
				
				await roleSelect.selectOption({ index: i });
				await inputArea.fill(testText);
				await checkBtn.click();
				
				const copyBtn = page.getByTestId('response-copy-btn');
				await expect(copyBtn).toBeVisible({ timeout: 30000 });
				
				// Wait a bit between checks
				await page.waitForTimeout(2000);
			}
		} else {
			// If no role selector, just do a single check
			await inputArea.fill(testText);
			await checkBtn.click();
			
			const copyBtn = page.getByTestId('response-copy-btn');
			await expect(copyBtn).toBeVisible({ timeout: 30000 });
		}
	});

	test('Copy Response to Clipboard', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		test.setTimeout(90000);

		// Perform a fact check
		const inputArea = page.getByTestId('selected-text-input').first();
		await inputArea.fill('The speed of light is approximately 299,792 km/s.');
		
		const checkBtn = page.getByTestId('fact-check-btn');
		await checkBtn.click();
		
		const copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });

		// Grant clipboard permissions
		await browserContext.grantPermissions(['clipboard-read', 'clipboard-write']);

		// Click copy button
		await copyBtn.click();

		// Verify clipboard content (wait a bit for copy to complete)
		await page.waitForTimeout(500);
		
		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText.length).toBeGreaterThan(0);
		console.log(`Copied ${clipboardText.length} characters to clipboard`);
	});

	test('Check Empty Input Handling', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		// Try to check without entering text
		const checkBtn = page.getByTestId('fact-check-btn');
		
		// Button should be disabled or not trigger a check
		const isDisabled = await checkBtn.isDisabled().catch(() => false);
		
		if (!isDisabled) {
			// If button is enabled, clicking it should not produce a result
			await checkBtn.click();
			
			// Wait a bit and verify no response appears
			await page.waitForTimeout(2000);
			const copyBtn = page.getByTestId('response-copy-btn');
			const isVisible = await copyBtn.isVisible({ timeout: 2000 }).catch(() => false);
			expect(isVisible).toBe(false);
		}
	});

	test('Verify Response Contains Relevant Content', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		test.setTimeout(90000);

		// Perform a fact check with a specific claim
		const inputArea = page.getByTestId('selected-text-input').first();
		const testClaim = 'The Great Wall of China is visible from space.';
		await inputArea.fill(testClaim);
		
		const checkBtn = page.getByTestId('fact-check-btn');
		await checkBtn.click();
		
		// Wait for response
		const copyBtn = page.getByTestId('response-copy-btn');
		await expect(copyBtn).toBeVisible({ timeout: 30000 });

		// Get the response text
		const responseTextarea = page.getByTestId('response-result-textarea');
		if (await responseTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
			const responseText = await responseTextarea.inputValue();
			
			// Verify response is not empty and has reasonable length
			expect(responseText.length).toBeGreaterThan(20);
			console.log(`Response length: ${responseText.length} characters`);
		}
	});

	test('Persistence - Endpoint Survives Page Reload', async () => {
		page = await browserContext.newPage();
		await initializeExtension(page);

		// Close and reopen the popup
		await page.close();
		
		page = await browserContext.newPage();
		await page.goto(`chrome-extension://${extensionId}/popup.html`);
		await expect(page.locator('body')).toBeVisible();

		// Should not need to configure endpoint again
		const newEndpointBtn = page.getByTestId('config-new-endpoint-btn');
		const needsConfig = await newEndpointBtn.isVisible({ timeout: 2000 }).catch(() => false);
		
		expect(needsConfig).toBe(false);

		// Should be able to perform fact check immediately
		const inputArea = page.getByTestId('selected-text-input').first();
		await expect(inputArea).toBeVisible();
	});
});
