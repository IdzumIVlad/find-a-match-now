import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  // Mock Google OAuth for testing
  async mockGoogleAuth() {
    await this.page.route('**/auth/v1/authorize**', async (route) => {
      // Redirect to callback with mock tokens
      const url = new URL(route.request().url());
      const redirectUri = url.searchParams.get('redirect_uri');
      if (redirectUri) {
        await route.fulfill({
          status: 302,
          headers: {
            'Location': `${redirectUri}#access_token=mock_token&token_type=bearer&expires_in=3600&refresh_token=mock_refresh&provider_token=mock_provider`
          }
        });
      }
    });

    // Mock token exchange
    await this.page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock_access_token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock_refresh_token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              email: 'test@example.com',
              name: 'Test User'
            }
          }
        })
      });
    });
  }

  // Create a test user with profile
  async createTestUser(role: 'employer' | 'candidate', phone = '+7 (999) 123-45-67') {
    // Navigate to auth page
    await this.page.goto('/auth');
    
    // Click sign up tab
    await this.page.click('[data-testid="signup-tab"]');
    
    // Fill signup form
    await this.page.fill('input[type="email"]', 'test@example.com');
    await this.page.fill('input[type="password"]', 'TestPassword123!');
    
    // Submit signup
    await this.page.click('button[type="submit"]');
    
    // Wait for profile completion modal
    await this.page.waitForSelector('[data-testid="complete-profile-modal"]');
    
    // Fill profile data
    await this.page.fill('input[placeholder*="телефон"]', phone);
    await this.page.check(`input[value="${role}"]`);
    
    // Submit profile
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect
    await this.page.waitForURL(role === 'employer' ? '/employer' : '/candidate');
  }

  // Wait for element to be visible
  async waitForVisible(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  // Check if element exists
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  // Fill form field by label
  async fillByLabel(label: string, value: string) {
    const field = await this.page.locator(`label:has-text("${label}") + input, label:has-text("${label}") + textarea`);
    await field.fill(value);
  }

  // Check for no PII leaks in response
  async checkNoPIILeak(response: any) {
    const body = await response.text();
    const jsonBody = JSON.parse(body);
    
    // Check that sensitive fields are not present
    const sensitiveFields = ['email', 'phone', 'employer_id', 'candidate_id'];
    
    const checkObject = (obj: any, path = '') => {
      for (const key in obj) {
        if (sensitiveFields.includes(key.toLowerCase())) {
          throw new Error(`PII leak detected: ${key} found at ${path}.${key}`);
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkObject(obj[key], `${path}.${key}`);
        }
      }
    };

    if (Array.isArray(jsonBody)) {
      jsonBody.forEach((item, index) => checkObject(item, `[${index}]`));
    } else {
      checkObject(jsonBody);
    }
  }
}