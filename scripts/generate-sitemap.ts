#!/usr/bin/env node
/**
 * Generate sitemap.xml for laburoGO
 * 
 * Usage:
 * - Development: npx tsx scripts/generate-sitemap.ts
 * - Production: Add to build process or run manually
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SITE_URL = process.env.VITE_SITE_URL || 'https://laburogо.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Static pages
const staticPages: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    loc: '/auth',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    loc: '/resumes',
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    loc: '/terms',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    loc: '/privacy',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    loc: '/contact',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

async function fetchPublishedJobs(): Promise<SitemapUrl[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1000); // Limit to avoid huge sitemaps

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    return (data || []).map(job => ({
      loc: `/jobs/${job.id}`,
      lastmod: job.updated_at || job.created_at,
      changefreq: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Unexpected error fetching jobs:', error);
    return [];
  }
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    const lastmod = url.lastmod ? new Date(url.lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    return `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

async function main() {
  console.log('🗺️  Generating sitemap.xml...');
  
  // Fetch dynamic content
  const jobUrls = await fetchPublishedJobs();
  console.log(`   Found ${jobUrls.length} published jobs`);
  
  // Combine all URLs
  const allUrls = [...staticPages, ...jobUrls];
  console.log(`   Total URLs: ${allUrls.length}`);
  
  // Generate XML
  const sitemapXml = generateSitemapXml(allUrls);
  
  // Write to public directory
  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`   Site URL: ${SITE_URL}`);
}

main().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
