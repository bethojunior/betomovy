const CACHE_NAME = 'static-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/webfiles/css/main.css',
                '/webfiles/css/iconfont/material-icons.css',
                '/webfiles/css/materialize.min.css',
                '/webfiles/js/libs/jquery-3.2.1.min.js',
                '/webfiles/js/libs/materialize.min.js',
                '/webfiles/img/logo/taxireturn.png',
                '/webfiles/img/logo/icon%20_%20vantagens.png',
                '/webfiles/img/logo/icon_%20desconto.png',
                '/webfiles/img/logo/icon%20_%20seguranca.png',
            ])
        })
    )
});

self.addEventListener('activate', function activator(event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                    return key.indexOf(CACHE_NAME) !== 0;
                }).map(function(key){
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener("fetch",function(event){
    event.respondWith(
        caches.match(event.request).then(function(cachedResponse){
            return cachedResponse || fetch(event.request);
        })
    );
});