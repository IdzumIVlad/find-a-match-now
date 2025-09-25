import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Candidate Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockGoogleAuth();
    await helpers.createTestUser('candidate');
  });

  test('should create new resume', async ({ page }) => {
    // Should be on candidate dashboard
    await expect(page).toHaveURL('/candidate');
    
    // Click create resume button
    await page.click('button:has-text("Создать резюме")');
    
    // Fill resume form
    await page.fill('input[placeholder*="Полное имя"]', 'Иван Иванов');
    await page.fill('input[placeholder*="Email"]', 'ivan@example.com');
    await page.fill('input[placeholder*="Телефон"]', '+7 (999) 123-45-67');
    await page.fill('textarea[placeholder*="Краткое описание"]', 'Опытный frontend разработчик');
    await page.fill('input[placeholder*="Навыки"]', 'React, TypeScript, Node.js');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('.toast')).toContainText('Резюме создано');
    
    // Should see resume in list
    await expect(page.locator('.resume-card')).toContainText('Иван Иванов');
  });

  test('should apply to job with existing resume', async ({ page }) => {
    // First create a resume
    await page.click('button:has-text("Создать резюме")');
    await page.fill('input[placeholder*="Полное имя"]', 'Петр Петров');
    await page.fill('input[placeholder*="Email"]', 'petr@example.com');
    await page.fill('input[placeholder*="Телефон"]', '+7 (999) 111-22-33');
    await page.click('button[type="submit"]');
    
    // Navigate to jobs page
    await page.goto('/');
    
    // Find and click on a job
    const jobCard = page.locator('.job-card').first();
    if (await jobCard.isVisible()) {
      await jobCard.click();
      
      // Click apply button
      await page.click('button:has-text("Отправить отклик")');
      
      // Select resume from dropdown
      await page.selectOption('select[name="resumeId"]', { label: 'Петр Петров' });
      
      // Add cover letter
      await page.fill('textarea[placeholder*="Сопроводительное письмо"]', 'Заинтересован в данной позиции');
      
      // Submit application
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('.toast')).toContainText('Отклик отправлен');
    }
  });

  test('should prevent duplicate applications', async ({ page }) => {
    // Create resume first
    await page.click('button:has-text("Создать резюме")');
    await page.fill('input[placeholder*="Полное имя"]', 'Анна Смирнова');
    await page.fill('input[placeholder*="Email"]', 'anna@example.com');
    await page.click('button[type="submit"]');
    
    // Navigate to jobs and apply to first job
    await page.goto('/');
    const jobCard = page.locator('.job-card').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      
      // First application
      await page.click('button:has-text("Отправить отклик")');
      await page.selectOption('select[name="resumeId"]', { label: 'Анна Смирнова' });
      await page.click('button[type="submit"]');
      
      // Wait for success
      await expect(page.locator('.toast')).toContainText('Отклик отправлен');
      
      // Try to apply again
      await page.click('button:has-text("Отправить отклик")');
      
      // Should show that already applied
      await expect(page.locator('.toast')).toContainText('Вы уже откликались на эту вакансию');
      
      // Or button should be disabled
      const applyButton = page.locator('button:has-text("Отправить отклик")');
      await expect(applyButton).toBeDisabled();
    }
  });

  test('should view own applications', async ({ page }) => {
    // Navigate to applications section
    await page.click('text=Мои отклики');
    
    // Should see applications page
    await expect(page.locator('h2')).toContainText('Мои отклики');
    
    // Should show empty state if no applications
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should edit own resume', async ({ page }) => {
    // Create resume first
    await page.click('button:has-text("Создать резюме")');
    await page.fill('input[placeholder*="Полное имя"]', 'Ольга Кузнецова');
    await page.fill('input[placeholder*="Email"]', 'olga@example.com');
    await page.click('button[type="submit"]');
    
    // Click edit button
    await page.click('button:has-text("Редактировать")');
    
    // Update name
    await page.fill('input[placeholder*="Полное имя"]', 'Ольга Петровна Кузнецова');
    await page.click('button[type="submit"]');
    
    // Should see updated name
    await expect(page.locator('.resume-card')).toContainText('Ольга Петровна Кузнецова');
  });

  test('should delete own resume', async ({ page }) => {
    // Create resume first
    await page.click('button:has-text("Создать резюме")');
    await page.fill('input[placeholder*="Полное имя"]', 'Максим Волков');
    await page.fill('input[placeholder*="Email"]', 'maxim@example.com');
    await page.click('button[type="submit"]');
    
    // Click delete button
    await page.click('button:has-text("Удалить")');
    
    // Confirm deletion
    await page.click('button:has-text("Да, удалить")');
    
    // Should show success message
    await expect(page.locator('.toast')).toContainText('Резюме удалено');
    
    // Resume should no longer be visible
    await expect(page.locator('text=Максим Волков')).not.toBeVisible();
  });
});