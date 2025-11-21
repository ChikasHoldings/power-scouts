import { useEffect, useRef } from 'react';
import { notifySearchEnginesOfUpdate } from './SitemapManager';

/**
 * Auto-notify search engines when new content is published
 * Use this hook in article creation/update workflows
 */
export function useAutoSitemapNotify(trigger = false, delay = 2000) {
  const hasNotified = useRef(false);

  useEffect(() => {
    if (trigger && !hasNotified.current) {
      hasNotified.current = true;
      
      // Delay to ensure content is saved first
      const timeoutId = setTimeout(async () => {
        console.log('🔔 Auto-triggering sitemap notification...');
        await notifySearchEnginesOfUpdate();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [trigger, delay]);
}

/**
 * Direct function to call after article operations
 */
export async function notifyAfterArticlePublish() {
  console.log('📝 New article published - notifying search engines...');
  await notifySearchEnginesOfUpdate();
}