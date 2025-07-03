// Importa los scripts de Firebase para el service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Configura Firebase en el service worker con tu configuración
firebase.initializeApp({
  apiKey: "AIzaSyCyN0cupVp_h-MERWxPpq0BNfr4NA_DVu0",
  authDomain: "libreria-cristo-rey.firebaseapp.com",
  projectId: "libreria-cristo-rey",
  storageBucket: "libreria-cristo-rey.firebasestorage.app",
  messagingSenderId: "470103234749",
  appId: "1:470103234749:web:c62b33f150b85a7fc73fd4"
});

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icono.png' // Pon un ícono que tengas en assets
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
