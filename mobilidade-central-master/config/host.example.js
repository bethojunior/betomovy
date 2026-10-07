const environment = getEnvironment();

function getEnvironment() {
    return {
        hosts: {
            local: "/",
            hostRequestApi: "<APIAPP_HOST>",
            hostSocketApi: "<API_SOCKET_HOST>",
            hostRequest: "<API_HOST>",
            hostNodeWhats : "https://api-notifier.704app.com.br/",
            hostImageDriver: "<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/driver/profile/compressed/",
            hostImageClient: "<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/customer/profile/compressed/",
            hostImageDefault: "<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/default.jpg",
            hostImageCentral: "https://<BUCKET_NAME>.s3<S3_BUCKET_REGION>.amazonaws.com/central/",
            hostAudio: "<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/chat/trip/",
            socketRealtime: "<ROUTE_HOST_TRIP_SHARE_URL>",
        },
        appPartner: "<APP_PARTNER>"
    }
}