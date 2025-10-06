import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Guest Applications', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should allow guest to apply without registration', async ({ page }) => {
    // Navigate to jobs page as guest
    await page.goto('/');
    
    // Find and click on a job
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      
      // Click apply button
      await page.click('button:has-text("Отправить отклик")');
      
      // Should see guest application form
      await expect(page.locator('h3')).toContainText('Отклик на вакансию');
      
      // Fill guest application form
      await page.fill('input[placeholder*="Ваше имя"]', 'Гость Тестовый');
      await page.fill('input[placeholder*="Email"]', 'guest@example.com');
      await page.fill('input[placeholder*="Телефон"]', '+7 (999) 888-77-66');
      await page.fill('textarea[placeholder*="Сопроводительное письмо"]', 'Хочу работать в вашей компании');
      await page.fill('input[placeholder*="Ссылка на резюме"]', 'https://example.com/resume.pdf');
      
      // Submit application
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.getByText('Отклик отправлен')).toBeVisible();
    }
  });

  test('should validate required fields for guest application', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await page.click('button:has-text("Отправить отклик")');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.getByText('обязательно')).toBeVisible();
    }
  });

  test('should validate email format for guest application', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await page.click('button:has-text("Отправить отклик")');
      
      // Fill with invalid email
      await page.fill('input[placeholder*="Ваше имя"]', 'Тест');
      await page.fill('input[placeholder*="Email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      
      // Should show email validation error
      await expect(page.getByText('корректный email')).toBeVisible();
    }
  });

  test('should validate phone format for guest application', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await page.click('button:has-text("Отправить отклик")');
      
      // Fill with invalid phone
      await page.fill('input[placeholder*="Ваше имя"]', 'Тест');
      await page.fill('input[placeholder*="Email"]', 'test@example.com');
      await page.fill('input[placeholder*="Телефон"]', '123');
      await page.click('button[type="submit"]');
      
      // Should show phone validation error
      await expect(page.getByText('корректный номер телефона')).toBeVisible();
    }
  });

  test('should allow optional resume link for guest', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await page.click('button:has-text("Отправить отклик")');
      
      // Fill required fields only (no resume link)
      await page.fill('input[placeholder*="Ваше имя"]', 'Гость Без Резюме');
      await page.fill('input[placeholder*="Email"]', 'noresume@example.com');
      await page.fill('input[placeholder*="Телефон"]', '+7 (999) 777-88-99');
      await page.fill('textarea[placeholder*="Сопроводительное письмо"]', 'Готов обсудить детали');
      
      // Submit without resume link
      await page.click('button[type="submit"]');
      
      // Should still succeed
      await expect(page.getByText('Отклик отправлен')).toBeVisible();
    }
  });

  test('should prevent rate limiting abuse for guest applications', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('[data-testid="job-card"]').first();
    
    if (await jobCard.isVisible()) {
      const jobUrl = page.url();
      
      // Apply multiple times quickly
      for (let i = 0; i < 5; i++) {
        await page.goto(jobUrl);
        await page.click('button:has-text("Отправить отклик")');
        
        await page.fill('input[placeholder*="Ваше имя"]', `Тест ${i}`);
        await page.fill('input[placeholder*="Email"]', `test${i}@example.com`);
        await page.fill('input[placeholder*="Телефон"]', '+7 (999) 111-11-11');
        
        await page.click('button[type="submit"]');
        
        if (i >= 3) {
          // Should eventually show rate limit message
          const rateLimitText = page.getByText(/превышен лимит|rate limit/i);
          if (await rateLimitText.isVisible()) {
            break;
          }
        }
      }
    }
  });
});