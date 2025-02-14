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
    
    // 檢查平台類型
    const platform = getPlatformType();
    
    // 根據平台取得對應的 URL
    const urlToOpen = getUrlByPlatform(payload, platform);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: {
            url: urlToOpen,
            platform: platform
        },
        tag: 'push-notification',
        badge: '/FirebasePWA-Test/icon-192x192.png',
        icon: '/FirebasePWA-Test/icon-192x192.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    console.log('收到通知點擊事件:', event);
    
    // 從通知數據中取得 URL 和平台資訊
    const platform = event.notification.data?.platform;
    const urlToOpen = event.notification.data?.url;
    
    if (urlToOpen) {
        event.notification.close();
        
        // 根據平台處理點擊事件
        switch(platform) {
            case 'android':
                // Android 特定處理
                event.waitUntil(clients.openWindow(urlToOpen));
                break;
                
            case 'ios':
                // iOS 特定處理
                event.waitUntil(
                    Promise.all([
                        clients.openWindow(urlToOpen),
                        // 可能需要其他 iOS 特定操作
                    ])
                );
                break;
                
            default:
                // Web 預設處理
                event.waitUntil(clients.openWindow(urlToOpen));
        }
    }
});

// 輔助函數：取得平台類型
function getPlatformType() {
    const userAgent = self.navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) {
        return 'android';
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        return 'ios';
    }
    return 'web';
}

// 輔助函數：根據平台取得 URL
function getUrlByPlatform(payload, platform) {
    switch(platform) {
        case 'android':
            return payload.android?.notification?.clickAction || 
                   payload.fcmOptions?.link;
            
        case 'ios':
            return payload.apns?.fcmOptions?.link || 
                   payload.fcmOptions?.link;
            
        default:
            return payload.fcmOptions?.link;
    }
}

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