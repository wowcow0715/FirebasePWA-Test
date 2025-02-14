// 引入 Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js');

// 快取設定
const CACHE_NAME = 'push-demo-v1';
const FILES_TO_CACHE = [
    '/FirebasePWA-Test/',
    '/FirebasePWA-Test/index.html',
    '/FirebasePWA-Test/manifest.json',
    '/FirebasePWA-Test/icon-192x192.png',
    '/FirebasePWA-Test/icon-512x512.png'
];

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
    console.log('收到背景訊息:', payload);
    
    // 檢查是否為 iOS PWA
    const isIOSPWA = 
        navigator.standalone || 
        window.matchMedia('(display-mode: standalone)').matches;
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: {
            url: payload.fcmOptions?.link
        },
        tag: isIOSPWA ? 'ios-pwa-notification' : 'push-notification',  // iOS PWA 使用特別的 tag
        renotify: false,  // 不重複提示
        badge: '/FirebasePWA-Test/icon-192x192.png',  // iOS 需要
        icon: '/FirebasePWA-Test/icon-192x192.png'    // iOS 需要
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    const urlToOpen = event.notification.data?.url;
    if (urlToOpen) {
        event.notification.close();
        event.waitUntil(clients.openWindow(urlToOpen));
    }
});

// PWA 快取功能
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
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