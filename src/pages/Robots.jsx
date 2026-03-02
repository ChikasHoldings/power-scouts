import React from "react";

export default function Robots() {
  const robotsTxt = `# Electric Scouts - Robots.txt
# https://electricscouts.com

User-agent: *
Allow: /

# Allow clean URL paths explicitly
Allow: /electricity-rates/
Allow: /learn/
Allow: /providers/
Allow: /compare-rates
Allow: /bill-analyzer
Allow: /all-providers
Allow: /all-states
Allow: /all-cities
Allow: /learning-center
Allow: /faq
Allow: /about-us
Allow: /blog

# Block admin, API, and internal areas
Disallow: /admin/
Disallow: /api/
Disallow: /go/
Disallow: /search?
Disallow: /user-settings
Disallow: /business-quote-dashboard
Disallow: /not-found

# Block legacy query param URLs (redirect to clean URLs)
Disallow: /city-rates?
Disallow: /article-detail?
Disallow: /app/

# Sitemap location
Sitemap: https://electricscouts.com/sitemap.xml
Sitemap: https://electricscouts.com/api/sitemap

# Google-specific rules
User-agent: Googlebot
Allow: /

# Bing-specific rules
User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Block AI crawlers from scraping content
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`;

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
