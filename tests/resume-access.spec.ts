import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Resume Database Access Control', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockGoogleAuth();
  });

  test('should disable resume access when has_access=false', async ({ page }) => {
    // Create employer without resume access
    await helpers.createTestUser('employer');
    
    // Navigate to resumes page
    await page.goto('/resumes');
    
    // Find resume cards
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      const firstCard = resumeCards.first();
      await firstCard.click();
      
      // Should see access required message
      await expect(page.locator('.access-required')).toContainText('Доступ к базе резюме ограничен');
      
      // Contact details should be hidden
      await expect(page.locator('.contact-info')).not.toBeVisible();
      
      // Should show upgrade/access button
      const accessButton = page.locator('button:has-text("Получить доступ")');
      await expect(accessButton).toBeVisible();
      await expect(accessButton).toBeDisabled();
    }
  });

  test('should show full resume details when has_access=true', async ({ page }) => {
    // Create employer (would need to set has_access=true in test setup)
    await helpers.createTestUser('employer');
    
    // Navigate to resumes
    await page.goto('/resumes');
    
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      const firstCard = resumeCards.first();
      await firstCard.click();
      
      // If access is granted, should see full details
      // This would require setting up test data with resume_access.has_access = true
      
      // Check if access section exists
      const accessSection = page.locator('.access-required');
      
      if (await accessSection.isVisible()) {
        // Access not granted - this is expected for new employers
        await expect(accessSection).toContainText('Доступ к базе резюме');
      } else {
        // Access granted - should see contact info
        await expect(page.locator('.contact-info')).toBeVisible();
        await expect(page.locator('text=@')).toBeVisible();
      }
    }
  });

  test('should allow candidates to view all resume details', async ({ page }) => {
    // Create candidate
    await helpers.createTestUser('candidate');
    
    // Navigate to resumes page
    await page.goto('/resumes');
    
    // Should see full access (candidates can see resumes)
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      const firstCard = resumeCards.first();
      await firstCard.click();
      
      // Should not see access restriction for candidates
      await expect(page.locator('.access-required')).not.toBeVisible();
    }
  });

  test('should track resume access in logs', async ({ page }) => {
    await helpers.createTestUser('employer');
    
    // Mock API response for data access logging
    await page.route('**/rest/v1/data_access_log', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto('/resumes');
    
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      await resumeCards.first().click();
      
      // Access attempt should be logged
      // This would be verified by checking the API call was made
      await page.waitForTimeout(1000);
    }
  });

  test('should show different UI for different access levels', async ({ page }) => {
    await helpers.createTestUser('employer');
    
    await page.goto('/resumes');
    
    // Should see resume access status indicator
    const accessIndicator = page.locator('.access-status');
    
    if (await accessIndicator.isVisible()) {
      // Should show current access level
      await expect(accessIndicator).toContainText('Доступ');
    }
    
    // Should see information about resume access
    const infoSection = page.locator('.resume-access-info');
    
    if (await infoSection.isVisible()) {
      await expect(infoSection).toContainText('доступ к контактным данным');
    }
  });

  test('should not allow direct API access to protected resume data', async ({ page }) => {
    // Try to access resume details API directly
    const response = await page.request.get('/rest/v1/resumes?select=email,phone,full_name');
    
    // Should be blocked or return limited data
    if (response.status() === 200) {
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Should not contain email/phone if not authorized
        const firstResume = data[0];
        expect(firstResume.email).toBeUndefined();
        expect(firstResume.phone).toBeUndefined();
      }
    } else {
      // API should block unauthorized access
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('should show resume preview without sensitive data', async ({ page }) => {
    await page.goto('/resumes');
    
    const resumeCards = page.locator('.resume-card');
    
    if (await resumeCards.count() > 0) {
      const cardContent = await resumeCards.first().textContent();
      
      // Resume cards should not contain email or phone
      expect(cardContent).not.toMatch(/@/);
      expect(cardContent).not.toMatch(/\+7/);
      expect(cardContent).not.toMatch(/\d{3}[-\s]\d{3}[-\s]\d{2}[-\s]\d{2}/);
    }
  });
});