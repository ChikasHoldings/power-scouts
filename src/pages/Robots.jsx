import React from "react";

export default function Robots() {
  const robotsTxt = `# ElectricScouts - Robots.txt
# Updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://electricscouts.com/sitemap.xml
Sitemap: https://electricscouts.com/app/SitemapXML

# Crawl-delay for politeness
Crawl-delay: 1

# Block admin areas
Disallow: /admin/
Disallow: /api/

# Allow all content and articles
Allow: /app/ArticleDetail
Allow: /app/LearningCenter
Allow: /compare-rates
Allow: /all-providers
Allow: /all-states
Allow: /all-cities

# Common search engine bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /`;

  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace', 
      fontSize: '12px',
      padding: '20px',
      background: '#f5f5f5',
      margin: 0
    }}>
      {robotsTxt}
    </pre>
  );
}