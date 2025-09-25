import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Public Access', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should allow viewing job listings without login', async ({ page }) => {
    await page.goto('/');
    
    // Should see job listings
    await expect(page.locator('h1')).toContainText('Доска объявлений');
    
    // Should see job cards (if any exist)
    const jobCards = page.locator('.job-card');
    
    // Job cards should be visible or show empty state
    if (await jobCards.count() > 0) {
      await expect(jobCards.first()).toBeVisible();
    } else {
      await expect(page.locator('.empty-state')).toBeVisible();
    }
  });

  test('should allow viewing individual job details without login', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('.job-card').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      
      // Should see job details page
      await expect(page.locator('h1')).toBeVisible();
      
      // Should see apply button for guests
      await expect(page.locator('button:has-text("Отправить отклик")')).toBeVisible();
    }
  });

  test('should allow viewing resume listings without login', async ({ page }) => {
    await page.goto('/resumes');
    
    // Should see resumes page
    await expect(page.locator('h1')).toContainText('База резюме');
    
    // Should see resume cards (if any exist) or empty state
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      await expect(resumeCards.first()).toBeVisible();
    } else {
      await expect(page.locator('.empty-state')).toBeVisible();
    }
  });

  test('should not expose PII in public job listings API', async ({ page }) => {
    // Intercept API calls to job listings
    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/jobs_public') || 
          response.url().includes('/rest/v1/get_public_jobs')) {
        
        if (response.status() === 200) {
          await helpers.checkNoPIILeak(response);
        }
      }
    });
    
    await page.goto('/');
    
    // Trigger API call by searching or filtering
    const searchInput = page.locator('input[placeholder*="Поиск"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('developer');
      await searchInput.press('Enter');
    }
  });

  test('should not expose PII in public resume listings API', async ({ page }) => {
    // Intercept API calls to resume listings
    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/resumes_public') ||
          response.url().includes('/rest/v1/get_public_resumes')) {
        
        if (response.status() === 200) {
          await helpers.checkNoPIILeak(response);
        }
      }
    });
    
    await page.goto('/resumes');
    
    // Wait for data to load
    await page.waitForTimeout(2000);
  });

  test('should not show employer contact info on public job pages', async ({ page }) => {
    await page.goto('/');
    
    const jobCard = page.locator('.job-card').first();
    
    if (await jobCard.isVisible()) {
      await jobCard.click();
      
      // Should not see employer email or phone
      await expect(page.locator('text=@')).not.toBeVisible();
      await expect(page.locator('text=+7')).not.toBeVisible();
      
      // Should not see employer ID
      const pageContent = await page.content();
      expect(pageContent).not.toMatch(/employer[_-]?id/i);
    }
  });

  test('should not show candidate contact info on public resume pages', async ({ page }) => {
    await page.goto('/resumes');
    
    const resumeCard = page.locator('.resume-card').first();
    
    if (await resumeCard.isVisible()) {
      await resumeCard.click();
      
      // Should not see candidate email or phone
      await expect(page.locator('text=@')).not.toBeVisible();
      await expect(page.locator('text=+7')).not.toBeVisible();
      
      // Should not see candidate ID
      const pageContent = await page.content();
      expect(pageContent).not.toMatch(/candidate[_-]?id/i);
    }
  });

  test('should allow search functionality without login', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder*="Поиск"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('React');
      await searchInput.press('Enter');
      
      // Should show filtered results or no results message
      await page.waitForTimeout(1000);
      
      // Page should still be accessible
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});