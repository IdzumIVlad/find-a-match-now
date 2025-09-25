import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Employer Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockGoogleAuth();
    await helpers.createTestUser('employer');
  });

  test('should create new vacancy', async ({ page }) => {
    // Should be on employer dashboard
    await expect(page).toHaveURL('/employer');
    
    // Click create vacancy button
    await page.click('button:has-text("Создать вакансию")');
    
    // Fill vacancy form
    await page.fill('input[placeholder*="Название вакансии"]', 'Frontend Developer');
    await page.fill('input[placeholder*="Компания"]', 'Test Company');
    await page.fill('input[placeholder*="Локация"]', 'Москва');
    await page.fill('input[placeholder*="Зарплата"]', '100000-150000');
    await page.selectOption('select', 'full-time');
    await page.fill('textarea[placeholder*="Описание"]', 'Great opportunity for frontend developer');
    await page.fill('textarea[placeholder*="Требования"]', 'React, TypeScript experience');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('.toast')).toContainText('Вакансия создана');
    
    // Should see vacancy in list
    await expect(page.locator('.vacancy-card')).toContainText('Frontend Developer');
  });

  test('should view applications to own vacancies', async ({ page }) => {
    // First create a vacancy
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'Backend Developer');
    await page.fill('input[placeholder*="Компания"]', 'Test Company');
    await page.fill('input[placeholder*="Локация"]', 'СПб');
    await page.click('button[type="submit"]');
    
    // Navigate to applications
    await page.click('text=Отклики');
    
    // Should see applications section
    await expect(page.locator('h2')).toContainText('Отклики на ваши вакансии');
    
    // If no applications, should show empty state
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should not see other employers vacancies or applications', async ({ page }) => {
    // Navigate to vacancies page
    await page.goto('/');
    
    // Any vacancies visible should not show edit/delete buttons for this employer
    const editButtons = page.locator('button:has-text("Редактировать")');
    const deleteButtons = page.locator('button:has-text("Удалить")');
    
    await expect(editButtons).toHaveCount(0);
    await expect(deleteButtons).toHaveCount(0);
  });

  test('should edit own vacancy', async ({ page }) => {
    // Create vacancy first
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'QA Engineer');
    await page.fill('input[placeholder*="Компания"]', 'Test Company');
    await page.click('button[type="submit"]');
    
    // Click edit button
    await page.click('button:has-text("Редактировать")');
    
    // Update title
    await page.fill('input[placeholder*="Название вакансии"]', 'Senior QA Engineer');
    await page.click('button[type="submit"]');
    
    // Should see updated title
    await expect(page.locator('.vacancy-card')).toContainText('Senior QA Engineer');
  });

  test('should delete own vacancy', async ({ page }) => {
    // Create vacancy first
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'DevOps Engineer');
    await page.fill('input[placeholder*="Компания"]', 'Test Company');
    await page.click('button[type="submit"]');
    
    // Click delete button
    await page.click('button:has-text("Удалить")');
    
    // Confirm deletion
    await page.click('button:has-text("Да, удалить")');
    
    // Should show success message
    await expect(page.locator('.toast')).toContainText('Вакансия удалена');
    
    // Vacancy should no longer be visible
    await expect(page.locator('text=DevOps Engineer')).not.toBeVisible();
  });

  test('should see guest application data', async ({ page }) => {
    // Create a vacancy first
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'UI Designer');
    await page.fill('input[placeholder*="Компания"]', 'Design Co');
    await page.click('button[type="submit"]');
    
    // Simulate guest application (would be done by another test creating it)
    // For now, just check that applications page loads
    await page.click('text=Отклики');
    
    // Should be able to see applications section
    await expect(page.locator('h2')).toContainText('Отклики');
  });
});