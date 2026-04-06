const CACHE_NAME = 'homos-platform-v1';
// أضف هنا جميع الملفات التي تريدها أن تعمل بدون إنترنت
const ASSETS_TO_CACHE = [
  './',
  './Homos.html',
  './manifest.json',
  './icon-512.PNG',
  // أضف هنا أي ملفات CSS أو JS أو صور أخرى تستخدمها
];

// 1. مرحلة التثبيت: حفظ الملفات في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. مرحلة التفعيل: حذف الكاش القديم إذا قمت بتحديث الإصدار
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. مرحلة جلب البيانات: عرض الملفات من الكاش إذا كان الإنترنت مقطوعاً
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجد الملف في الكاش يعرضه، وإذا لم يجده يطلبه من الإنترنت
      return response || fetch(event.request);
    }).catch(() => {
        // إذا فشل الإنترنت ولم يجد الملف في الكاش (صفحة خطأ اختيارية)
        return caches.match('./khroga.html');
    })
  );
});
