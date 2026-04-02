// هذا الكود يجعل المتصفح يعترف بالموقع كـ PWA
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', (event) => {
  // يمكن تركها فارغة حالياً، لكن وجودها ضروري للتثبيت
});
