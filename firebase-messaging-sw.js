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
    console.log('payload.data:', payload.data);  // 新增除錯資訊
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/FirebasePWA-Test/icon-192x192.png',
        data: payload.data,  // 確保 data 正確傳遞
        tag: 'notification-' + Date.now()  // 新增唯一標籤
    };

    console.log('notificationOptions:', notificationOptions);  // 新增除錯資訊
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', function(event) {
    console.log('通知被點擊:', event);
    console.log('notification data:', event.notification.data);  // 新增除錯資訊

    // 關閉通知
    event.notification.close();

    // 取得通知中的資料
    const data = event.notification.data;
    console.log('解析後的 data:', data);  // 新增除錯資訊
    
    // 檢查是否有 URL 需要開啟
    if (data && data.type === 'openUrl' && data.url) {
        console.log('準備開啟 URL:', data.url);  // 新增除錯資訊
        const urlToOpen = new URL(data.url).href;
        console.log('格式化後的 URL:', urlToOpen);  // 新增除錯資訊

        event.waitUntil(
            // 先檢查是否有已開啟的視窗
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(function(clientList) {
                console.log('找到的視窗列表:', clientList);  // 新增除錯資訊

                // 尋找已開啟的標籤頁
                for (let client of clientList) {
                    console.log('檢查視窗:', client.url);  // 新增除錯資訊
                    if (client.url === urlToOpen && 'focus' in client) {
                        console.log('找到相符的視窗，切換焦點');  // 新增除錯資訊
                        return client.focus();
                    }
                }
                
                // 如果沒有找到已開啟的標籤頁，嘗試開啟新視窗
                if (clients.openWindow) {
                    console.log('嘗試開啟新視窗');  // 新增除錯資訊
                    return clients.openWindow(urlToOpen).catch(error => {
                        console.error('開啟視窗失敗:', error);
                        // 如果無法開啟視窗，可以在這裡提供替代方案
                    });
                }
                
                console.log('此裝置不支援自動開啟視窗');
            }).catch(error => {
                console.error('處理視窗時發生錯誤:', error);  // 新增除錯資訊
            })
        );
    } else {
        console.log('通知中沒有有效的 URL 資訊');  // 新增除錯資訊
        console.log('data.type:', data ? data.type : 'undefined');
        console.log('data.url:', data ? data.url : 'undefined');
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
