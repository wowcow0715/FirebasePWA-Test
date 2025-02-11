// 引入 Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 初始化 Firebase
firebase.initializeApp({
    apiKey: "AIzaSyAYVGDCxwf3WewHD9gMhWr_LmCxY94rjnU",
    authDomain: "test-2ed10.firebaseapp.com",
    projectId: "test-2ed10",
    storageBucket: "test-2ed10.firebasestorage.app",
    messagingSenderId: "450067672312",
    appId: "1:450067672312:web:3acf400cdb748501f05f0d",
    measurementId: "G-8WZ6D00R06"
});

// 初始化 Messaging
const messaging = firebase.messaging();

// 處理背景訊息
messaging.onBackgroundMessage((payload) => {
    console.log('收到背景訊息:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './icon-192x192.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
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