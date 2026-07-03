'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

export function PushSubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsLoading(false);
        return;
      }
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (err) {
        console.error('Error checking push subscription:', err);
      }
      setIsLoading(false);
    }
    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      if (!('serviceWorker' in navigator)) throw new Error('No Service Worker support!');
      if (!('PushManager' in window)) throw new Error('No Push API Support!');

      const registration = await navigator.serviceWorker.ready;
      
      if (isSubscribed) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) await subscription.unsubscribe();
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) throw new Error('No VAPID public key available');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      if (!res.ok) throw new Error('Failed to save subscription on server');

      setIsSubscribed(true);
    } catch (err) {
      console.error('Subscription failed:', err);
      alert('Failed to subscribe to notifications: ' + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render button on unsupported browsers like some desktop Safari versions
  // but SSR safe
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!('serviceWorker' in window.navigator) || !('PushManager' in window)) {
    return null; // Don't show button if unsupported
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isSubscribed 
          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
          : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : isSubscribed ? <Bell size={18} /> : <BellOff size={18} />}
      {isLoading ? 'Processing...' : isSubscribed ? 'Notifications On' : 'Enable Notifications'}
    </button>
  );
}
