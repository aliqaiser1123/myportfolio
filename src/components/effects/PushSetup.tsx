'use client';

import { useEffect } from 'react';

export function PushSetup() {
  useEffect(() => {
    // 1. Check for browser support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    // 2. Register the service worker
    navigator.serviceWorker.register('/sw.js')
      .then(async (registration) => {
        // 3. Ask the user for permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // 4. Subscribe (VAPID public key must be Base64-URL-encoded)
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
            console.error('VAPID public key not found');
            return;
        }

        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });

        // 5. Send subscription to your backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      })
      .catch((err) => console.error('SW registration failed', err));
  }, []);

  // Helper to convert the VAPID key (plain base64 string) to Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return null; // No UI, just side-effects
}
