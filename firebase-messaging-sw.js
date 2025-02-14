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
    console.log('收到背景訊息:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://raw.githubusercontent.com/wowcow0715/FirebasePWA-Test/refs/heads/main/icon-192x192.png',
        data: {
            url: payload.webpush.fcmOptions.link  // 儲存點擊後要開啟的URL
        },
        tag: 'notification-' + Date.now()
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    console.log('通知被點擊:', event);
    
    // 關閉通知
    event.notification.close();

    // 取得要開啟的URL
    const urlToOpen = event.notification.data.url;
    
    if (urlToOpen) {
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(function(clientList) {
                // 直接開啟新視窗
                return clients.openWindow(urlToOpen);
            })
        );
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

// 安裝時不進行快取
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 啟動時清除舊的快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
}); 