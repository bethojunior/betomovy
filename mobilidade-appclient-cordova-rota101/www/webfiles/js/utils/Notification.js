class PushNotification{
    static sendRequest(title , textBody){

        PushNotification.checkPermition(title, textBody)
    }

    static checkPermition(title, textBody ) {
        if(Notification.permission === 'denied') {
            Notification.requestPermission()
                .then(res => {
                    console.log('denied '+res)
                    if(res === 'granted') {
                        PushNotification.sendNotification(title, textBody)
                    }
                })
            return
        }

        if(Notification.permission === 'default') {
            Notification.requestPermission()
                .then(res => {
                    console.log('default '+res)
                    if(res === 'granted') {
                        PushNotification.sendNotification(title, textBody)
                    }
                })
            return
        }

        if(Notification.permission === 'granted') {
            PushNotification.sendNotification(title, textBody)
            return
        }
    }

   static sendNotification(title, textBody) {

        navigator
            .serviceWorker
            .ready
                .then(registration => {
                    const options = {
                            body: textBody,
                            icon: HOST+"webfiles/img/logo/taxireturn.png"
                    }
                    registration.showNotification(title,options)
                })
    }
}