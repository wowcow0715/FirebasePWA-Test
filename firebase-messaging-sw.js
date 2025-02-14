// 引入 Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js');

// 初始化 Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDZklXfy-QFX2aFxveT-rubiSamhRLL3S4",
    authDomain: "best777h5.firebaseapp.com",
    projectId: "best777h5",
    storageBucket: "best777h5.firebasestorage.app",
    messagingSenderId: "129060872565",
    appId: "1:129060872565:web:b81c63bd4a65c8eb73b33c",
    measurementId: "G-49JKD0RD91"
});

// 初始化 Messaging
const messaging = firebase.messaging();

// 處理背景訊息
messaging.onBackgroundMessage((payload) => {
    console.log('收到背景訊息:', payload);  // 保留這個日誌便於調試
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: {
            url: payload.fcmOptions?.link
        },
        // 為 iOS 添加以下選項
        badge: '/FirebasePWA-Test/icon-192x192.png',  // iOS 需要
        icon: '/FirebasePWA-Test/icon-192x192.png',   // iOS 需要
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    const urlToOpen = event.notification.data?.url;
    if (urlToOpen) {
        event.notification.close();
        // 開啟指定的 URL
        event.waitUntil(clients.openWindow(urlToOpen));
    }
});

// PWA 相關功能
const CACHE_NAME = 'push-demo-v1';

// 簡化快取策略
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// 處理 PWA 安裝事件
self.addEventListener('install', (event) => {
    self.skipWaiting();  // 立即激活新的 Service Worker
});

// 處理 PWA 激活事件
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());  // 立即接管所有頁面
}); 
