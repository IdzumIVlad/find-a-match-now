import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'job_posting';
  image?: string;
  url?: string;
  keywords?: string;
  // Job-specific fields
  jobTitle?: string;
  companyName?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  datePosted?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  type = 'website',
  image,
  url,
  keywords,
  jobTitle,
  companyName,
  location,
  salaryMin,
  salaryMax,
  isRemote,
  datePosted
}) => {
  const siteUrl = 'https://laburogо.com'; // Update with your actual domain
  const fullTitle = `${title} | laburoGO`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const ogImage = image || `${siteUrl}/og-image.png`; // Default OG image
  
  // Generate structured data for job postings
  const generateJobStructuredData = () => {
    if (type !== 'job_posting' || !jobTitle || !companyName) return null;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobTitle,
      "description": description,
      "hiringOrganization": {
        "@type": "Organization",
        "name": companyName
      },
      "datePosted": datePosted || new Date().toISOString(),
      "jobLocation": location ? {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location,
          "addressCountry": "AR"
        }
      } : undefined,
      "baseSalary": (salaryMin || salaryMax) ? {
        "@type": "MonetaryAmount",
        "currency": "ARS",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": salaryMin,
          "maxValue": salaryMax,
          "unitText": "MONTH"
        }
      } : undefined,
      "employmentType": isRemote ? "CONTRACTOR" : "FULL_TIME"
    };
    
    // Remove undefined fields
    return JSON.parse(JSON.stringify(structuredData));
  };

  const jobStructuredData = generateJobStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Spanish" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === 'job_posting' ? 'article' : type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="laburoGO" />
      <meta property="og:locale" content="es_AR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@laburoGO" />
      <meta name="twitter:creator" content="@laburoGO" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="laburoGO" />
      <meta name="theme-color" content="#7C3AED" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Structured Data for Jobs */}
      {jobStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(jobStructuredData)}
        </script>
      )}
      
      {/* General Organization Structured Data */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "laburoGO",
            "url": siteUrl,
            "description": "Plataforma de búsqueda de empleo en Argentina. Conecta empleadores con candidatos de forma rápida y eficiente.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteUrl}/?search={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;