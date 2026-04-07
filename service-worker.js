const CACHE_NAME = 'homos-platform-v2'; // غيرنا الاسم لـ v2 عشان نحدث النسخة عند الناس
const ASSETS_TO_CACHE = [
  './',
  './Homos.html',
  './manifest.json',
  './icon-512.PNG'
  // لو عندك ملفات CSS أو JS تانية ضيفها هنا بنفس الطريقة
];

// 1. مرحلة التثبيت والتحديث الفوري
self.addEventListener('install', (event) => {
  self.skipWaiting(); // بيجبر النسخة الجديدة تشتغل فوراً أول ما ترفعها
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('HOMOS: Caching essential assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. مرحلة التفعيل وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('HOMOS: Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. استراتيجية "النت أولاً" (Network First)
// دي أحسن لموقع بيع وشراء عشان الأسعار والإعلانات تتحدث دايماً
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // لو فيه إنترنت، بياخد نسخة من اللي جابه ويحطها في الكاش للمرة الجاية
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // لو النت مقطوع، بيدور في الكاش يعرض النسخة اللي عنده
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('./Homos.html');
        });
      })
  );
});
