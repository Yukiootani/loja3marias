importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// 🚨 SUAS CHAVES (Confirme se estão certas)
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
  console.log('[firebase-messaging-sw.js] Recebido em background:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://i.imgur.com/BIXdM6M.png', // Ícone do App
    
    // 🚨 NOVAS OPÇÕES PARA FORÇAR O ANDROID 🚨
    tag: 'push-notification-tag', // Evita empilhar muitas mensagens
    renotify: true, // Vibra mesmo se tiver outra notificação antiga
    requireInteraction: true, // A mensagem não some sozinha, exige clique
    data: {
        url: payload.notification.click_action || 'https://loja3marias.netlify.app'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🚨 NOVO: Ao clicar na notificação, abre o App
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
