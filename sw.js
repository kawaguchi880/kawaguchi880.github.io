// ServiceWorker処理：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja

// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
  '/PWA_TEST/',
  '/PWA_TEST/css/common.css',
  '/PWA_TEST/js/alarm.js'
];

// インストール処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        return response ? response : fetch(event.request);
      })
  );
});

