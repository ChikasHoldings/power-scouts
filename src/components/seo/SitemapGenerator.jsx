/**
 * Sitemap Generator Utility
 * Generates XML sitemap data for all pages, states, cities, and content
 */

const SITE_URL = 'https://electricscouts.com';

// Priority levels
const PRIORITY = {
  critical: '1.0',
  high: '0.9',
  medium: '0.7',
  low: '0.5'
};

// Change frequency
const FREQ = {
  always: 'always',
  hourly: 'hourly',
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
  never: 'never'
};

// Core pages
export const CORE_PAGES = [
  { url: '/', priority: PRIORITY.critical, changefreq: FREQ.daily },
  { url: '/landing', priority: PRIORITY.critical, changefreq: FREQ.daily },
  { url: '/compare-rates', priority: PRIORITY.critical, changefreq: FREQ.daily },
  { url: '/business-electricity', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/business-compare-rates', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/renewable-energy', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/renewable-compare-rates', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/savings-calculator', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/bill-analyzer', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/all-providers', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/all-states', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/all-cities', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/learning-center', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/faq', priority: PRIORITY.high, changefreq: FREQ.monthly },
  { url: '/about-us', priority: PRIORITY.medium, changefreq: FREQ.monthly },
  { url: '/home-concierge', priority: PRIORITY.medium, changefreq: FREQ.monthly },
  { url: '/business-hub', priority: PRIORITY.medium, changefreq: FREQ.monthly },
  { url: '/privacy-policy', priority: PRIORITY.low, changefreq: FREQ.yearly },
  { url: '/terms-of-service', priority: PRIORITY.low, changefreq: FREQ.yearly }
];

// State pages
export const STATE_PAGES = [
  { url: '/texas-electricity', name: 'Texas', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/illinois-electricity', name: 'Illinois', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/ohio-electricity', name: 'Ohio', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/pennsylvania-electricity', name: 'Pennsylvania', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/new-york-electricity', name: 'New York', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/new-jersey-electricity', name: 'New Jersey', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/maryland-electricity', name: 'Maryland', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/massachusetts-electricity', name: 'Massachusetts', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/maine-electricity', name: 'Maine', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/new-hampshire-electricity', name: 'New Hampshire', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/rhode-island-electricity', name: 'Rhode Island', priority: PRIORITY.high, changefreq: FREQ.weekly },
  { url: '/connecticut-electricity', name: 'Connecticut', priority: PRIORITY.high, changefreq: FREQ.weekly }
];

// Generate sitemap XML
export function generateSitemapXML(pages) {
  const urls = pages.map(page => {
    const lastmod = new Date().toISOString().split('T')[0];
    return `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

// Generate robots.txt content
export function generateRobotsTxt() {
  return `# ElectricScouts - Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?*thank-you
Disallow: /*?*confirmation

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay (optional, for heavy crawlers)
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 0

# Allow important resources
Allow: /static/
Allow: /*.css
Allow: /*.js
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.webp
Allow: /*.svg
`;
}

// Get all sitemap URLs
export function getAllSitemapURLs() {
  return [...CORE_PAGES, ...STATE_PAGES];
}