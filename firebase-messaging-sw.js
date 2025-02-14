// 引入 Firebase Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js");

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

// 初始化 Analytics
const analytics = firebase.analytics();

// 處理背景訊息
messaging.onBackgroundMessage((payload) => {
    console.log('收到背景訊息:', payload);
    
    // 記錄背景推播接收
    analytics.logEvent('background_push_received', {
        title: payload.notification?.title || 'no_title',
        body: payload.notification?.body || 'no_body',
        has_data: !!payload.data,
        timestamp: new Date().toISOString(),
        message_type: payload.data ? 'data' : 'notification'
    });
    
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
    
    // 記錄通知點擊
    analytics.logEvent('push_notification_clicked', {
        title: event.notification.title,
        body: event.notification.body,
        tag: event.notification.tag,
        timestamp: new Date().toISOString(),
        has_url: !!event.notification.data?.url
    });
    
    // 關閉通知
    event.notification.close();

    // 取得要開啟的URL
    const urlToOpen = event.notification.data.url;
    
    if (urlToOpen) {
        // 記錄 URL 開啟
        analytics.logEvent('push_url_opened', {
            url: urlToOpen,
            timestamp: new Date().toISOString()
        });

        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(function(clientList) {
                // 如果沒有找到已開啟的標籤頁,開啟新視窗
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