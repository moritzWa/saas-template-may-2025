import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/landing');

    // Check hero title is visible
    await expect(page.getByRole('heading', { name: /Build your SaaS faster/i })).toBeVisible();

    // Check CTA buttons are visible
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Demo/i })).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/landing');

    // Check FAQ heading is visible
    await expect(page.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeVisible();

    // Check at least one FAQ item is visible
    await expect(page.getByText(/How do I get started/i)).toBeVisible();
  });

  test('should navigate to login when clicking Get Started', async ({ page }) => {
    await page.goto('/landing');

    await page.getByRole('button', { name: /Get Started/i }).click();

    // Should navigate to login page
    await expect(page).toHaveURL('/login');
  });
});
