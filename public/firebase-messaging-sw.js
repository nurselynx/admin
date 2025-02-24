/* eslint-disable no-undef */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

let firebaseConfig = null;

// Listen for messages from the main app to get the Firebase config
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
});

// Function to clean HTML content
function cleanHTML(input) {
  return input.replace(/<\/?b>/g, '');
}

// Wait for Firebase to be initialized before handling messages
self.addEventListener('activate', () => {
  if (firebaseConfig) {
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification.title;
      const notificationBody = cleanHTML(payload.notification.body);
      const notificationOptions = {
        body: notificationBody,
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});
