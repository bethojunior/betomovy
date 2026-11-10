const environment = getEnvironment();

function getEnvironment() {
    return {
        hosts: {
            local: "/",
            hostRequestApi: "<APIAPP_HOST>",
            hostSocketApi: "<API_SOCKET_HOST>",
            hostRequest: "<API_HOST>",
            hostNodeWhats : "https://api.movymob.com/",
            hostImageDriver: "https://s3<S3_BUCKET_REGION>.amazonaws.com/<BUCKET_NAME>/driver/profile/compressed/",
            hostImageClient: "https://s3<S3_BUCKET_REGION>.amazonaws.com/<BUCKET_NAME>/customer/profile/compressed/",
            hostImageDefault: "https://s3<S3_BUCKET_REGION>.amazonaws.com/<BUCKET_NAME>/default.jpg",
            hostImageCentral: "https://<BUCKET_NAME>.s3<S3_BUCKET_REGION>.amazonaws.com/central/",
            hostAudio: "https://s3<S3_BUCKET_REGION>.amazonaws.com/<BUCKET_NAME>/chat/trip/",
        },
        appPartner: "<APP_PARTNER>"
    }
}