import React from "react";
import { Helmet } from "react-helmet";
import { generateCanonicalURL, generateOGData, generateTwitterData, getRobotsTag } from "./SEOConfig";

/**
 * Enhanced SEO Head Component
 * Comprehensive meta tags, Open Graph, Twitter Cards, and more
 */
export default function EnhancedSEOHead({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage,
  ogType = 'website',
  article = null,
  structuredData = null,
  alternates = null
}) {
  const fullTitle = title.includes('ElectricScouts') ? title : `${title} | ElectricScouts`;
  const canonicalURL = canonical ? generateCanonicalURL(canonical) : null;
  const robotsTag = noindex ? getRobotsTag('noindex') : getRobotsTag('public');
  
  const ogData = generateOGData('default', {
    title: fullTitle,
    description,
    url: canonicalURL,
    image: ogImage || '/images/og-image.png',
    type: ogType
  });
  
  const twitterData = generateTwitterData({
    title: fullTitle,
    description,
    image: ogData.image
  });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsTag} />
      <meta name="googlebot" content={robotsTag} />
      
      {/* Canonical */}
      {canonicalURL && <link rel="canonical" href={canonicalURL} />}
      
      {/* Language */}
      <html lang="en" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogData.type} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogData.image} />
      <meta property="og:image:width" content={ogData.imageWidth} />
      <meta property="og:image:height" content={ogData.imageHeight} />
      <meta property="og:site_name" content={ogData.siteName} />
      <meta property="og:locale" content={ogData.locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterData.card} />
      <meta name="twitter:site" content={twitterData.site} />
      <meta name="twitter:creator" content={twitterData.creator} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterData.image} />
      
      {/* Article Specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags && article.tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0A5C8C" />
      
      {/* PWA / App Links */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ElectricScouts" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Author & Publisher */}
      <meta name="author" content="ElectricScouts" />
      <meta name="publisher" content="ElectricScouts" />
      
      {/* Copyright */}
      <meta name="copyright" content={`© ${new Date().getFullYear()} ElectricScouts. All rights reserved.`} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Helmet>
  );
}