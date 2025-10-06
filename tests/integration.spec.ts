import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Integration Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockGoogleAuth();
  });

  test('should complete full hiring workflow', async ({ page, context }) => {
    // 1. Employer creates account and vacancy
    await helpers.createTestUser('employer');
    
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'Full Stack Developer');
    await page.fill('input[placeholder*="Компания"]', 'Tech Company');
    await page.fill('input[placeholder*="Локация"]', 'Москва');
    await page.fill('input[placeholder*="Зарплата"]', '150000-200000');
    await page.click('button[type="submit"]');
    
    // Get job URL for later
    const jobUrl = page.url();
    
    // 2. Create candidate in new context
    const candidatePage = await context.newPage();
    const candidateHelpers = new TestHelpers(candidatePage);
    await candidateHelpers.mockGoogleAuth();
    await candidateHelpers.createTestUser('candidate', '+7 (999) 555-44-33');
    
    // 3. Candidate creates resume
    await candidatePage.click('button:has-text("Создать резюме")');
    await candidatePage.fill('input[placeholder*="Полное имя"]', 'Александр Разработчиков');
    await candidatePage.fill('input[placeholder*="Email"]', 'alex@example.com');
    await candidatePage.fill('input[placeholder*="Телефон"]', '+7 (999) 555-44-33');
    await candidatePage.fill('textarea[placeholder*="Краткое описание"]', 'Опытный full-stack разработчик');
    await candidatePage.click('button[type="submit"]');
    
    // 4. Candidate applies to job
    await candidatePage.goto('/');
    const jobCard = candidatePage.locator('.job-card:has-text("Full Stack Developer")');
    await jobCard.click();
    
    await candidatePage.click('button:has-text("Отправить отклик")');
    await candidatePage.selectOption('select[name="resumeId"]', { label: 'Александр Разработчиков' });
    await candidatePage.fill('textarea[placeholder*="Сопроводительное письмо"]', 'Очень заинтересован в позиции');
    await candidatePage.click('button[type="submit"]');
    
    await expect(candidatePage.getByText('Отклик отправлен')).toBeVisible();
    
    // 5. Employer sees application
    await page.click('text=Отклики');
    await expect(page.locator('[data-testid="application-card"]')).toContainText('Александр Разработчиков');
    
    // 6. Guest also applies to same job
    const guestPage = await context.newPage();
    await guestPage.goto('/');
    
    const guestJobCard = guestPage.locator('[data-testid="job-card"]:has-text("Full Stack Developer")');
    await guestJobCard.click();
    
    await guestPage.click('button:has-text("Отправить отклик")');
    await guestPage.fill('input[placeholder*="Ваше имя"]', 'Гость Программист');
    await guestPage.fill('input[placeholder*="Email"]', 'guest.programmer@example.com');
    await guestPage.fill('input[placeholder*="Телефон"]', '+7 (999) 777-66-55');
    await guestPage.fill('textarea[placeholder*="Сопроводительное письмо"]', 'Готов обсудить возможности');
    await guestPage.click('button[type="submit"]');
    
    await expect(guestPage.getByText('Отклик отправлен')).toBeVisible();
    
    // 7. Employer sees both applications
    await page.reload();
    const applications = page.locator('[data-testid="application-card"]');
    await expect(applications).toHaveCount(2);
    
    await candidatePage.close();
    await guestPage.close();
  });

  test('should enforce data isolation between employers', async ({ page, context }) => {
    // Create first employer
    await helpers.createTestUser('employer');
    
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'Backend Developer');
    await page.fill('input[placeholder*="Компания"]', 'Company A');
    await page.click('button[type="submit"]');
    
    // Create second employer in new context
    const employer2Page = await context.newPage();
    const employer2Helpers = new TestHelpers(employer2Page);
    await employer2Helpers.mockGoogleAuth();
    
    // Use different email for second employer
    await employer2Page.goto('/auth');
    await employer2Page.click('[data-testid="signup-tab"]');
    await employer2Page.fill('input[type="email"]', 'employer2@example.com');
    await employer2Page.fill('input[type="password"]', 'TestPassword123!');
    await employer2Page.click('button[type="submit"]');
    
    await employer2Helpers.waitForVisible('[data-testid="complete-profile-modal"]');
    await employer2Page.fill('input[placeholder*="телефон"]', '+7 (999) 888-77-66');
    await employer2Page.check('input[value="employer"]');
    await employer2Page.click('button[type="submit"]');
    
    // Second employer creates their vacancy
    await employer2Page.click('button:has-text("Создать вакансию")');
    await employer2Page.fill('input[placeholder*="Название вакансии"]', 'Frontend Developer');
    await employer2Page.fill('input[placeholder*="Компания"]', 'Company B');
    await employer2Page.click('button[type="submit"]');
    
    // Each employer should only see their own vacancies
    await expect(page.locator('[data-testid="vacancy-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="vacancy-card"]')).toContainText('Backend Developer');
    await expect(page.locator('[data-testid="vacancy-card"]')).not.toContainText('Frontend Developer');
    
    await expect(employer2Page.locator('[data-testid="vacancy-card"]')).toHaveCount(1);
    await expect(employer2Page.locator('[data-testid="vacancy-card"]')).toContainText('Frontend Developer');
    await expect(employer2Page.locator('[data-testid="vacancy-card"]')).not.toContainText('Backend Developer');
    
    await employer2Page.close();
  });

  test('should handle concurrent applications correctly', async ({ page, context }) => {
    // Create employer and job
    await helpers.createTestUser('employer');
    
    await page.click('button:has-text("Создать вакансию")');
    await page.fill('input[placeholder*="Название вакансии"]', 'DevOps Engineer');
    await page.fill('input[placeholder*="Компания"]', 'DevOps Co');
    await page.click('button[type="submit"]');
    
    // Create multiple candidates applying simultaneously
    const candidates = [];
    
    for (let i = 0; i < 3; i++) {
      const candidatePage = await context.newPage();
      const candidateHelpers = new TestHelpers(candidatePage);
      await candidateHelpers.mockGoogleAuth();
      
      // Create unique candidate
      await candidatePage.goto('/auth');
      await candidatePage.click('[data-testid="signup-tab"]');
      await candidatePage.fill('input[type="email"]', `candidate${i}@example.com`);
      await candidatePage.fill('input[type="password"]', 'TestPassword123!');
      await candidatePage.click('button[type="submit"]');
      
      await candidateHelpers.waitForVisible('[data-testid="complete-profile-modal"]');
      await candidatePage.fill('input[placeholder*="телефон"]', `+7 (999) 00${i}-11-22`);
      await candidatePage.check('input[value="candidate"]');
      await candidatePage.click('button[type="submit"]');
      
      candidates.push({ page: candidatePage, helpers: candidateHelpers });
    }
    
    // All candidates apply concurrently
    const applicationPromises = candidates.map(async (candidate, index) => {
      // Create resume
      await candidate.page.click('button:has-text("Создать резюме")');
      await candidate.page.fill('input[placeholder*="Полное имя"]', `Кандидат ${index + 1}`);
      await candidate.page.fill('input[placeholder*="Email"]', `candidate${index}@example.com`);
      await candidate.page.click('button[type="submit"]');
      
      // Apply to job
      await candidate.page.goto('/');
      const jobCard = candidate.page.locator('[data-testid="job-card"]:has-text("DevOps Engineer")');
      await jobCard.click();
      
      await candidate.page.click('button:has-text("Отправить отклик")');
      await candidate.page.selectOption('select[name="resumeId"]', { label: `Кандидат ${index + 1}` });
      await candidate.page.click('button[type="submit"]');
      
      return candidate.page.locator('.toast').textContent();
    });
    
    // Wait for all applications
    const results = await Promise.all(applicationPromises);
    
    // All should succeed
    results.forEach(result => {
      expect(result).toContain('Отклик отправлен');
    });
    
    // Employer should see all 3 applications
    await page.click('text=Отклики');
    await expect(page.locator('[data-testid="application-card"]')).toHaveCount(3);
    
    // Cleanup
    for (const candidate of candidates) {
      await candidate.page.close();
    }
  });
});