import { test, expect } from './fixtures';

// Helper to wait for save to complete (debounce + network)
async function waitForSave(page: import('@playwright/test').Page) {
  // Wait for debounce (500ms) + network request
  await page.waitForTimeout(700);
  await page.waitForLoadState('networkidle');
}

test.describe('Document CRUD', () => {
  test('should create a new document', async ({ page }) => {
    // Should be on home page with auth tokens injected
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();

    // Click "New Document" button
    await page.getByRole('button', { name: /New Document/i }).click();

    // Should navigate to new document page
    await expect(page).toHaveURL(/\/documents\/.+/);

    // Title input should be visible with default placeholder
    await expect(page.getByPlaceholder('Document title')).toBeVisible();
  });

  test('should edit document title and content', async ({ page }) => {
    // Create a new document first
    await page.getByRole('button', { name: /New Document/i }).click();
    await expect(page).toHaveURL(/\/documents\/.+/);

    // Edit title first and wait for save (debounce resets on each call, so we must wait)
    await page.getByPlaceholder('Document title').fill('My Test Document');
    await waitForSave(page);

    // Edit content
    await page.getByPlaceholder('Start writing...').fill('This is the content of my test document.');
    await waitForSave(page);

    // Navigate back to home
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page).toHaveURL('/');

    // Reload to ensure fresh data (React Query cache workaround)
    await page.reload();

    // Verify document appears in list with correct title (use .first() for main content area)
    await expect(page.getByRole('link', { name: /My Test Document/i }).first()).toBeVisible();
  });

  test('should read document after navigation', async ({ page }) => {
    // Create a document with specific content
    await page.getByRole('button', { name: /New Document/i }).click();
    await expect(page).toHaveURL(/\/documents\/.+/);

    const testTitle = `Test Doc ${Date.now()}`;
    const testContent = 'Content for reading test';

    // Edit title first and wait (debounce resets on each call)
    await page.getByPlaceholder('Document title').fill(testTitle);
    await waitForSave(page);

    // Edit content and wait
    await page.getByPlaceholder('Start writing...').fill(testContent);
    await waitForSave(page);

    // Go back to list
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page).toHaveURL('/');

    // Reload to ensure fresh data (React Query cache workaround)
    await page.reload();

    // Click on the document to open it (use .first() to avoid sidebar duplicate)
    await page.getByRole('link', { name: new RegExp(testTitle) }).first().click();

    // Verify content is loaded correctly
    await expect(page.getByPlaceholder('Document title')).toHaveValue(testTitle);
    await expect(page.getByPlaceholder('Start writing...')).toHaveValue(testContent);
  });

  test('should delete a document', async ({ page }) => {
    // Create a document to delete
    await page.getByRole('button', { name: /New Document/i }).click();
    await expect(page).toHaveURL(/\/documents\/.+/);

    const deleteTestTitle = `Delete Test ${Date.now()}`;
    await page.getByPlaceholder('Document title').fill(deleteTestTitle);

    // Wait for debounced save to complete
    await waitForSave(page);

    // Set up dialog handler before clicking delete
    page.on('dialog', (dialog) => dialog.accept());

    // Click delete button
    await page.getByRole('button', { name: /Delete/i }).click();

    // Should navigate back to home
    await expect(page).toHaveURL('/');

    // Document should no longer appear in list
    await expect(page.getByRole('link', { name: new RegExp(deleteTestTitle) })).not.toBeVisible();
  });
});
