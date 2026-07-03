import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const supabase = await createClient();

    // 1. Insert message into Supabase
    const { data: newMessage, error: insertError } = await supabase
      .from('messages')
      .insert([{
        name: data.name || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        subject: data.subject || null,
        message: data.message || null,
        read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting message:', insertError);
      return NextResponse.json({ error: 'Failed to insert message' }, { status: 500 });
    }

    // 2. Fetch all admin push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (!subError && subscriptions && subscriptions.length > 0) {
      // 3. Send Web Push to all endpoints
      const notificationPayload = JSON.stringify({
        title: 'New Message Received',
        body: `From: ${data.name || data.whatsapp || data.email || 'Anonymous'}\nSubject: ${data.subject || 'No Subject'}`,
        url: '/admin/messages'
      });

      const pushPromises = subscriptions.map(async (sub) => {
        try {
          // Send push
          await webpush.sendNotification(sub.subscription, notificationPayload);
        } catch (e: any) {
          if (e.statusCode === 404 || e.statusCode === 410) {
            // Subscription has expired or is no longer valid, delete it
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          } else {
            console.error('Error sending push notification', e);
          }
        }
      });

      await Promise.allSettled(pushPromises);
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err) {
    console.error('Message API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
