importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: ${GOOGLE_API_KEY},
  authDomain: "supple-voyage-458619-j4.firebaseapp.com",
  projectId: "supple-voyage-458619-j4",
  storageBucket: "supple-voyage-458619-j4.appspot.com",
  messagingSenderId: "1046524391013",
  appId: "1:1046524391013:web:9947a7e8c897ace23e608c",
  measurementId: "G-N2E2MZN5HN"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Warranty Vault';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
