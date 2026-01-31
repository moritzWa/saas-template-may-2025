import { test, expect } from '@playwright/test';

// TODO: Set up auth mocking or test user credentials
// For now, these tests assume you're logged in manually or have a test auth setup

test.describe('Document CRUD', () => {
  test.skip('should create a new document', async ({ page }) => {
    // Setup: Mock auth token in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'test-token');
    });
    await page.reload();

    // Click create document button in sidebar
    await page.getByRole('button', { name: /New Document/i }).click();

    // Should navigate to new document page
    await expect(page).toHaveURL(/\/documents\/.+/);
  });

  test.skip('should edit document title and content', async ({ page }) => {
    // Navigate to document (replace with actual document ID)
    await page.goto('/documents/test-document-id');

    // Edit title
    const titleInput = page.getByPlaceholder('Document title');
    await titleInput.fill('Test Document Title');

    // Edit content
    const contentInput = page.getByPlaceholder('Start writing...');
    await contentInput.fill('This is test content');

    // Wait for auto-save
    await page.waitForTimeout(600);

    // Verify saving indicator appeared
    await expect(page.getByText('Saving...')).toBeVisible();
  });

  test.skip('should delete a document', async ({ page }) => {
    await page.goto('/documents/test-document-id');

    // Click delete button
    await page.getByRole('button', { name: /Delete/i }).click();

    // Confirm deletion in dialog
    page.on('dialog', (dialog) => dialog.accept());

    // Should navigate back to home
    await expect(page).toHaveURL('/');
  });
});
