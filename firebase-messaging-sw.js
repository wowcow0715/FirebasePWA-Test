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
    
    // 只處理含有 url 的推播
    if (!payload.data?.url) {
        console.log('忽略沒有 URL 的推播');
        return;
    }

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: {
            url: payload.data.url  // 使用 data 中的 url
        },
        tag: 'push-notification-' + Date.now(),  // 使用時間戳確保唯一性
        renotify: false,  // 避免重複通知
        badge: '/FirebasePWA-Test/icon-192x192.png',
        icon: '/FirebasePWA-Test/icon-192x192.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    console.log('收到通知點擊事件:', event);
    
    const urlToOpen = event.notification.data?.url;
    if (!urlToOpen) return;

    event.notification.close();
    
    // 檢查是否有開啟的視窗
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(function(clientList) {
            // 檢查是否為 iOS PWA
            const isIOSPWA = self.navigator?.standalone || 
                            clientList.some(client => 
                                client.url.includes('apple-mobile-web-app'));
            
            if (isIOSPWA) {
                // iOS PWA 模式：強制開新視窗
                return clients.openWindow(urlToOpen).then(windowClient => {
                    // 確保新視窗成功開啟
                    if (!windowClient) {
                        // 如果開啟失敗，嘗試使用備用方法
                        const newWindow = new WindowClient(urlToOpen);
                        return newWindow;
                    }
                    return windowClient;
                });
            } else {
                // 其他情況：也是開新視窗
                return clients.openWindow(urlToOpen);
            }
        })
        .catch(error => {
            console.error('開啟視窗失敗:', error);
            // 發生錯誤時的備用方案
            return clients.openWindow(urlToOpen);
        })
    );
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
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key); // 清理舊快取
                }
            }));
        })
    );
    return self.clients.claim(); // 立即接管所有頁面
});