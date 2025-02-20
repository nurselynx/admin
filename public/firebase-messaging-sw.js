/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCpgz8KhGA9jJLX8ucLHsyjHZb-vLy6fRE',
  authDomain: 'nurselynx-2fb1c.firebaseapp.com',
  projectId: 'nurselynx-2fb1c',
  storageBucket: 'nurselynx-2fb1c.firebasestorage.app',
  messagingSenderId: '1032811457113',
  appId: '1:1032811457113:web:a499698213013554f7df48',
  measurementId: 'G-HMJG2K78W6',
});

function cleanHTML(input) {
  // Remove <b> tags but keep their content
  return input.replace(/<\/?b>/g, ''); // Removes opening and closing <b> tags
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationBody = cleanHTML(payload.notification.body); // Clean HTML content
  const notificationOptions = {
    body: notificationBody,
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
