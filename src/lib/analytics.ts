// Google Analytics 4 Integration

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID;

/**
 * Initialize Google Analytics 4
 */
export const initGA4 = () => {
  if (!GA4_ID) {
    console.warn('GA4_ID not configured. Analytics disabled.');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, {
    send_page_view: false, // We'll handle page views manually
  });
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string) => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

/**
 * Track job search
 */
export const trackSearchJobs = (params: {
  query?: string;
  location?: string;
  filters_count?: number;
}) => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'search_jobs', {
    query: params.query || '',
    location: params.location || '',
    filters_count: params.filters_count || 0,
  });
};

/**
 * Track job view
 */
export const trackViewJob = (params: {
  job_id: string;
  company_id?: string;
  location?: string;
  is_remote?: boolean;
}) => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'view_job', {
    job_id: params.job_id,
    company_id: params.company_id || '',
    location: params.location || '',
    is_remote: params.is_remote || false,
  });
};

/**
 * Track job application
 */
export const trackApplyJob = (params: {
  job_id: string;
  company_id?: string;
}) => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'apply_job', {
    job_id: params.job_id,
    company_id: params.company_id || '',
  });
};

/**
 * Track candidate signup
 */
export const trackSignupCandidate = () => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'signup_candidate', {});
};

/**
 * Track employer signup
 */
export const trackSignupEmployer = () => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'signup_employer', {});
};

/**
 * Track job posting
 */
export const trackPostJob = (params: {
  job_id: string;
  paid: boolean;
}) => {
  if (!GA4_ID || !window.gtag) return;

  window.gtag('event', 'post_job', {
    job_id: params.job_id,
    paid: params.paid,
  });
};
