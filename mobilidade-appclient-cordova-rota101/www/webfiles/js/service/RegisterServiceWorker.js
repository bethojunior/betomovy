var ServiceWorkerRegistration

if ('serviceWorker' in navigator) {
    ServiceWorkerRegistration = navigator.serviceWorker.register(HOST+ "ServiceWorker.js")
    ServiceWorkerRegistration
        .then(function (registration) {
                console.log('Service Worker Registered');
            }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });

    navigator.serviceWorker.ready.then(function (registration) {
        console.log('Service Worker Ready');
    });
}