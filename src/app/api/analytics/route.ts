import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST: Track an analytics event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, metadata } = body;

    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';

    const validEvents = ['page_view', 'resume_download', 'project_click', 'blog_read', 'github_click'];
    if (!validEvents.includes(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const supabase = await createClient();

    // Upsert global analytics counter
    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('id', 'global')
      .single();

    if (existing) {
      await supabase
        .from('analytics')
        .update({
          page_views: event === 'page_view' ? (existing.page_views || 0) + 1 : existing.page_views,
          last_updated: new Date().toISOString(),
        })
        .eq('id', 'global');
    } else {
      await supabase.from('analytics').insert({
        page_views: event === 'page_view' ? 1 : 0,
        unique_visitors: 0,
        last_updated: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}

// GET: Fetch analytics summary for admin dashboard
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: analyticsRows } = await supabase
      .from('analytics')
      .select('*')
      .limit(1)
      .single();

    const global = {
      page_view: analyticsRows?.page_views || 0,
      unique_visitors: analyticsRows?.unique_visitors || 0,
    };

    return NextResponse.json({ global, daily: [], topItems: [] });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
