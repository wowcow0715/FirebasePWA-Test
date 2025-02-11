<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Firebase 推播測試</title>
    <link rel="manifest" href="manifest.json">
    
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"></script>

    <script>
        // Firebase 設定
        const firebaseConfig = {
            apiKey: "AIzaSyAYVGDCxwf3WewHD9gMhWr_LmCxY94rjnU",
            authDomain: "test-2ed10.firebaseapp.com", 
            projectId: "test-2ed10",
            storageBucket: "test-2ed10.firebasestorage.app",
            messagingSenderId: "450067672312",
            appId: "1:450067672312:web:3acf400cdb748501f05f0d",
            measurementId: "G-8WZ6D00R06"
        };

        // 初始化 Firebase
        firebase.initializeApp(firebaseConfig);

        // 初始化 Firebase Messaging 並設定 Service Worker
        const messaging = firebase.messaging();

        // 註冊 Service Worker
        async function registerServiceWorker() {
            try {
                const registration = await navigator.serviceWorker.register(
                    '/FirebasePWA-Test/firebase-messaging-sw.js',
                    { scope: '/FirebasePWA-Test/' }
                );
                console.log('Service Worker 註冊成功:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker 註冊失敗:', error);
                throw error;
            }
        }

        // 請求通知權限
        async function requestNotificationPermission() {
            try {
                // 先註冊 Service Worker
                const registration = await registerServiceWorker();

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const token = await messaging.getToken({
                        vapidKey: 'BOpyDrJ40jf_n5gWt_9sIPsWHjy5OOsl69zfY1iQHOHEi0khcsvgT1r81_xhAnGdZo9gryowJQhhnS4WesI-teA',
                        serviceWorkerRegistration: registration
                    });
                    console.log('FCM Token:', token);
                    document.getElementById('token').textContent = token;
                }
            } catch (error) {
                console.error('取得權限失敗:', error);
            }
        }

        // 處理前景訊息
        messaging.onMessage((payload) => {
            console.log('收到訊息:', payload);
            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/FirebasePWA-Test/icon-192x192.png'
            };
            new Notification(notificationTitle, notificationOptions);
        });

        // 頁面載入時註冊 Service Worker
        if ('serviceWorker' in navigator) {
            registerServiceWorker().catch(console.error);
        }
    </script>
</head>
<body>
    <h1>Firebase 推播測試</h1>
    <button onclick="requestNotificationPermission()">請求通知權限</button>
    <p>FCM Token: <span id="token"></span></p>
</body>
</html> 
