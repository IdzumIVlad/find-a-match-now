# Job Board Platform

A modern job board application connecting employers with candidates, built with React, Vite, TypeScript, and Supabase.

## 📋 Description

This platform enables:
- **Employers**: Post job vacancies, manage applications, view candidate resumes
- **Candidates**: Create resumes, apply to jobs, track application status
- **Guests**: Browse jobs and apply without registration
- **Admins**: Manage users, moderate content, configure system settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended via [nvm](https://github.com/nvm-sh/nvm))
- pnpm (or npm/yarn)
- Supabase CLI (optional, for local development)

### Local Development

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
pnpm dev
```

The app will be available at `http://localhost:8080`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_GA4_ID=your_google_analytics_id

# reCAPTCHA (Optional)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

⚠️ **Security**: Never commit `.env` to version control. Use `.env.example` for reference only.

## 🗄️ Database Migrations

### Migration Files Location
All SQL migrations are stored in `supabase/migrations/`

### Applying Migrations

**Using Supabase CLI (Local Development):**
```bash
# Start local Supabase
supabase start

# Reset database and apply all migrations
supabase db reset

# Push new migrations to remote
supabase db push
```

**Using Supabase Dashboard:**
1. Navigate to SQL Editor in your Supabase project
2. Copy migration SQL from `supabase/migrations/`
3. Execute the SQL

### Key Database Tables
- `profiles` - User profiles with role information
- `vacancies` - Job postings by employers
- `resumes` - Candidate resumes and CVs
- `applications` - Job applications (candidate and guest)
- `resume_access` - Paid access control for resume database
- `events` - Analytics and event tracking
- `outbox_webhooks` - Webhook delivery system

## 👥 User Roles

### Candidate
- Create and manage resumes
- Apply to job vacancies
- View own applications
- Edit profile information

### Employer
- Post job vacancies
- Manage own job listings
- View applications to own jobs
- Access candidate resumes (with paid access)

### Admin
- Full system access
- User management
- Content moderation
- System configuration

**Note**: Admin roles are managed via the `user_roles` table, not in profiles.

## 🧪 Test Accounts

For testing purposes, create accounts via the signup flow or use seed data:

```sql
-- Example seed (adapt to your needs)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES 
  ('candidate@example.com', crypt('TestPassword123', gen_salt('bf')), now()),
  ('employer@example.com', crypt('TestPassword123', gen_salt('bf')), now());

INSERT INTO public.profiles (id, email, phone, role)
SELECT id, email, '+1234567890', 'candidate' FROM auth.users WHERE email = 'candidate@example.com'
UNION ALL
SELECT id, email, '+0987654321', 'employer' FROM auth.users WHERE email = 'employer@example.com';
```

**Test Credentials** (fictional):
- Candidate: `candidate@example.com` / `TestPassword123`
- Employer: `employer@example.com` / `TestPassword123`

## 📦 Available Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:8080)

# Build
pnpm build            # Production build
pnpm preview          # Preview production build

# Testing
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:headed  # Run tests in headed mode

# View Playwright test report
npx playwright show-report

# Linting
pnpm lint             # Run ESLint
```

## 🔄 Continuous Integration

CI runs automatically on push/PR to main branch via GitHub Actions (`.github/workflows/ci.yml`):

- **Build**: Validates that `pnpm build` succeeds
- **Tests**: Runs all Playwright E2E tests
- **Artifacts**: On test failure, downloads `playwright-report` artifact from GitHub Actions run page
- **Cache**: pnpm store and Playwright browsers cached for faster runs

### CI Environment Setup

CI uses `.env.example.ci` (test credentials, no secrets). To test CI locally:

```bash
cp .env.example.ci .env
pnpm install --frozen-lockfile
pnpm build
npx playwright install --with-deps
pnpm test:e2e
```

### Viewing Test Reports

- **Locally**: Run `npx playwright show-report` after tests
- **In CI**: Download `playwright-report` artifact from failed GitHub Actions run, extract, and open `index.html`

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── ApplicationForm.tsx
│   ├── JobCard.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Index.tsx       # Home page
│   ├── Auth.tsx        # Authentication
│   ├── Dashboard.tsx   # User dashboard
│   ├── Employer.tsx    # Employer dashboard
│   └── ...
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and config
│   ├── i18n.ts        # Internationalization
│   └── utils.ts       # Helper functions
├── integrations/       # Third-party integrations
│   └── supabase/      # Supabase client & types
└── main.tsx           # App entry point

supabase/
├── functions/          # Edge Functions
│   ├── send-application/
│   ├── webhook-dispatcher/
│   └── ...
├── migrations/         # SQL migration files
└── config.toml        # Supabase configuration

tests/                 # E2E tests (Playwright)
├── auth.spec.ts
├── employer-dashboard.spec.ts
└── ...
```

## 🔒 Security Best Practices

1. **Environment Variables**: 
   - Never commit `.env` to Git
   - Use `.env.example` with placeholder keys only
   - Store secrets in Supabase Vault for Edge Functions

2. **Row Level Security (RLS)**:
   - All tables have RLS enabled
   - Users can only access their own data
   - Service role bypasses RLS (use carefully)

3. **Authentication**:
   - Passwords validated server-side
   - Session tokens stored securely
   - Rate limiting on sensitive endpoints

4. **API Keys**:
   - Publishable keys (anon) are safe for client-side
   - Service role keys NEVER exposed to client
   - Third-party keys stored in Supabase Secrets

## 🐛 Known Issues

- [ ] Resume PDF parsing not yet implemented (raw text import only)
- [ ] Email notifications may delay during high traffic
- [ ] Safari may have layout issues with complex forms
- [ ] Webhook retry logic limited to 3 attempts

## 🗺️ Roadmap

### Short-term
- [ ] Resume file upload with PDF parsing
- [ ] Advanced search filters (location, salary, skills)
- [ ] Email notification templates
- [ ] Multi-language support (i18n expansion)

### Mid-term
- [ ] Real-time notifications via WebSocket
- [ ] Video interview scheduling integration
- [ ] AI-powered resume matching
- [ ] Analytics dashboard for employers

### Long-term
- [ ] Mobile app (React Native)
- [ ] ATS (Applicant Tracking System) integration
- [ ] Premium subscription tiers
- [ ] Blockchain-verified credentials

---

## 📚 Additional Resources

- [Lovable Project Dashboard](https://lovable.dev/projects/489d4e25-7ee0-42c0-997c-83be7481b5a7)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License

This project is proprietary. All rights reserved.
