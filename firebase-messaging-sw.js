importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// SUAS CHAVES REAIS
const firebaseConfig = {
    apiKey: "AIzaSyDtQK3dZKTqoTkXkwTUM2vkviVD41UoHpI",
    authDomain: "loja3marias-50204.firebaseapp.com",
    projectId: "loja3marias-50204",
    storageBucket: "loja3marias-50204.firebasestorage.app",
    messagingSenderId: "405330133487",
    appId: "1:405330133487:web:606de41211df52245f761a",
    measurementId: "G-TK877V6P0S"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://i.imgur.com/BIXdM6M.png', // Ícone
    
    // 🚨 TRUQUE PARA ANDROID TELA BLOQUEADA 🚨
    tag: 'push-alert-' + Date.now(), // Tag única para sempre tocar
    renotify: true, // Força vibração/som
    requireInteraction: true, // Fica na tela até clicar
    
    data: {
        url: payload.notification.click_action || 'https://loja3marias.netlify.app'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
