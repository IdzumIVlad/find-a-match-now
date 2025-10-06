import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Authentication Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockGoogleAuth();
  });

  test('should complete signup flow with email/password', async ({ page }) => {
    await page.goto('/auth');
    
    // Click signup tab
    await page.click('[data-testid="signup-tab"]');
    
    // Fill signup form
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.getByText('Регистрация успешна')).toBeVisible();
  });

  test('should complete profile and redirect based on role - employer', async ({ page }) => {
    await helpers.createTestUser('employer');
    
    // Should be redirected to employer dashboard
    await expect(page).toHaveURL('/employer');
    await expect(page.locator('h1')).toContainText('Панель работодателя');
  });

  test('should complete profile and redirect based on role - candidate', async ({ page }) => {
    await helpers.createTestUser('candidate');
    
    // Should be redirected to candidate dashboard
    await expect(page).toHaveURL('/candidate');
    await expect(page.locator('h1')).toContainText('Панель соискателя');
  });

  test('should handle Google OAuth signup', async ({ page }) => {
    await page.goto('/auth');
    
    // Click Google signin button
    await page.click('button:has-text("Войти через Google")');
    
    // Wait for redirect back to auth
    await page.waitForURL('/auth');
    
    // Should show profile completion modal
    await helpers.waitForVisible('[data-testid="complete-profile-modal"]');
    
    // Complete profile
    await page.fill('input[placeholder*="телефон"]', '+7 (999) 123-45-67');
    await page.check('input[value="candidate"]');
    await page.click('button[type="submit"]');
    
    // Should redirect to candidate dashboard
    await expect(page).toHaveURL('/candidate');
  });

  test('should validate phone format in profile completion', async ({ page }) => {
    await page.goto('/auth');
    await page.click('[data-testid="signup-tab"]');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await helpers.waitForVisible('[data-testid="complete-profile-modal"]');
    
    // Try invalid phone format
    await page.fill('input[placeholder*="телефон"]', '123456789');
    await page.check('input[value="candidate"]');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.getByText('Введите корректный номер телефона')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    // First create a user (this would normally be done via setup)
    await helpers.createTestUser('employer');
    await page.goto('/');
    
    // Navigate to auth
    await page.goto('/auth');
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Should redirect to employer dashboard
    await expect(page).toHaveURL('/employer');
  });
});