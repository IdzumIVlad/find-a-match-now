# E2E Tests

Comprehensive end-to-end tests for the Job Board application using Playwright.

## Test Scenarios

### 1. Authentication (`auth.spec.ts`)
- Email/password signup and login
- Google OAuth with mocking
- Profile completion with phone validation
- Role-based redirects (employer/candidate)
- Form validation

### 2. Employer Dashboard (`employer-dashboard.spec.ts`)
- Create, edit, delete vacancies
- View applications to own jobs
- Data isolation (can't see other employers' data)
- Application management

### 3. Candidate Dashboard (`candidate-dashboard.spec.ts`)
- Create, edit, delete resumes
- Apply to jobs with resume selection
- Duplicate application prevention
- View own applications

### 4. Guest Applications (`guest-application.spec.ts`)
- Apply without registration
- Form validation (name, email, phone)
- Optional resume link
- Rate limiting protection

### 5. Public Access (`public-access.spec.ts`)
- View job/resume listings without login
- Search functionality
- PII leak prevention in API responses
- No sensitive data exposure

### 6. Resume Access Control (`resume-access.spec.ts`)
- Access control based on `resume_access.has_access`
- Different UI for different access levels
- Contact info visibility rules
- Access logging

### 7. Integration Tests (`integration.spec.ts`)
- Full hiring workflow (employer → candidate → guest)
- Data isolation between employers
- Concurrent applications handling

## Running Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e:headed

# Run specific test file
npx playwright test auth.spec.ts

# Generate test report
npx playwright show-report
```

## Test Data Requirements

Tests expect certain test attributes in components:
- `data-testid="signup-tab"` on signup tab
- `data-testid="complete-profile-modal"` on profile modal
- Form inputs with proper placeholders
- Buttons with recognizable text

## Security Testing

Tests verify:
- No PII in public API responses
- Proper data isolation between users
- Access control enforcement
- Rate limiting functionality

## Mock Setup

- Google OAuth is mocked for consistent testing
- Supabase responses can be mocked as needed
- Session management is handled automatically