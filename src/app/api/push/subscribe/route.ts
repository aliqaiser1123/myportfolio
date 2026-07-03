import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const supabase = await createClient();

    // Check if the user is authenticated (admin only should subscribe)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert or update subscription in database
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        subscription: subscription, // Store entire object
        created_at: new Date().toISOString()
      }, { onConflict: 'endpoint' });

    if (error) {
      // If table doesn't exist, log it for user to fix, but don't crash
      console.warn('Could not save push subscription. Ensure push_subscriptions table exists.', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
