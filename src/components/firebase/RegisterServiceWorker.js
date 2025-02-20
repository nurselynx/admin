"use client";

// components/RegisterServiceWorker.js
import { useEffect } from 'react';

const RegisterServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker only if not already registered
      if (navigator.serviceWorker.controller) {
        console.log('Service Worker already registered.');
        return;
      }

      const swUrl = '/firebase-messaging-sw.js';

      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;
