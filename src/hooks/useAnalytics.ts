'use client';

import { useCallback } from 'react';

type AnalyticsEvent = 
  | 'page_view'
  | 'resume_download'
  | 'project_click'
  | 'blog_read'
  | 'github_click';

interface TrackOptions {
  slug?: string;
  title?: string;
  type?: 'project' | 'blog' | 'github';
}

export function useAnalytics() {
  const track = useCallback(async (event: AnalyticsEvent, metadata?: TrackOptions) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, metadata }),
      });
    } catch (error) {
      // Silent fail — never block user interactions for analytics
    }
  }, []);

  return { track };
}
