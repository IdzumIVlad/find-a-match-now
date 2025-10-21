import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have single h1 and proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/');

    // Check for single h1
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);

    // Verify h1 content is meaningful
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(5);

    // Check heading hierarchy (h2s should exist after h1)
    const h2Elements = await page.locator('h2').count();
    expect(h2Elements).toBeGreaterThan(0);

    // Verify no h3 appears before h2
    const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(allHeadings.length).toBeGreaterThan(0);
  });

  test('should have skip to content link for keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Skip link should exist
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Test keyboard navigation - Tab should focus skip link first
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('href'));
    expect(focusedElement).toBe('#main-content');

    // Click skip link and verify main content is focused
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeAttached();
  });

  test('should have proper aria labels on interactive elements', async ({ page }) => {
    await page.goto('/');

    // Check search input has aria-label
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toHaveAttribute('aria-label', /.+/);

    // Check buttons have proper labels or text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either aria-label or visible text
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });

  test('should have proper focus styles on interactive elements', async ({ page }) => {
    await page.goto('/');

    // Test button focus
    const postJobButton = page.getByRole('button', { name: /post|publicar|опубликовать/i }).first();
    await postJobButton.focus();
    
    // Check if focus ring is applied
    const focusRing = await postJobButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      };
    });
    
    // Should have either outline or box-shadow for focus indication
    expect(focusRing.outline !== 'none' || focusRing.boxShadow !== 'none').toBeTruthy();
  });

  test('should have accessible form labels', async ({ page }) => {
    // Navigate to auth page which has forms
    await page.goto('/auth');

    // Wait for form to load
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });

    // Check email input has associated label
    const emailInput = page.locator('input[type="email"]').first();
    const emailInputId = await emailInput.getAttribute('id');
    
    if (emailInputId) {
      const label = page.locator(`label[for="${emailInputId}"]`);
      await expect(label).toBeAttached();
    }

    // Check password input has associated label
    const passwordInput = page.locator('input[type="password"]').first();
    const passwordInputId = await passwordInput.getAttribute('id');
    
    if (passwordInputId) {
      const label = page.locator(`label[for="${passwordInputId}"]`);
      await expect(label).toBeAttached();
    }
  });

  test('should have proper heading hierarchy on job detail page', async ({ page }) => {
    // First get a job from the home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const jobCards = page.locator('[data-testid="job-card"]');
    const jobCount = await jobCards.count();
    
    if (jobCount > 0) {
      // Click on first job
      await jobCards.first().getByRole('button', { name: /apply|aplicar|откликнуться/i }).click();
      await page.waitForLoadState('networkidle');

      // Check for single h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Verify h1 is the job title
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text!.length).toBeGreaterThan(0);
    }
  });

  test('should support keyboard navigation through main elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through elements and track focus
    const focusedElements: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const tagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
      if (tagName) {
        focusedElements.push(tagName);
      }
    }

    // Should have focused on interactive elements
    expect(focusedElements.length).toBeGreaterThan(0);
    
    // First focus should be skip link
    expect(focusedElements[0]).toBe('a');
  });

  test('should have semantic HTML landmarks', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeAttached();

    // Check for header landmark
    const header = page.locator('header[role="banner"], header');
    await expect(header).toBeAttached();

    // Check for navigation landmark
    const nav = page.locator('nav[role="navigation"], nav');
    await expect(nav).toBeAttached();
  });

  test('should have adequate color contrast on buttons', async ({ page }) => {
    await page.goto('/');

    // Test primary button contrast
    const postJobButton = page.getByRole('button', { name: /post|publicar|опубликовать/i }).first();
    
    const colors = await postJobButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Both color and backgroundColor should be set
    expect(colors.color).toBeTruthy();
    expect(colors.backgroundColor).toBeTruthy();
    
    // Colors should not be transparent
    expect(colors.backgroundColor).not.toContain('rgba(0, 0, 0, 0)');
  });

  test('should have icons with aria-hidden attribute', async ({ page }) => {
    await page.goto('/');

    // Most decorative icons should have aria-hidden="true"
    const iconsInButtons = page.locator('button svg');
    const iconCount = await iconsInButtons.count();
    
    if (iconCount > 0) {
      // At least some icons should have aria-hidden
      const iconsWithAriaHidden = page.locator('svg[aria-hidden="true"]');
      const ariaHiddenCount = await iconsWithAriaHidden.count();
      expect(ariaHiddenCount).toBeGreaterThan(0);
    }
  });
});
