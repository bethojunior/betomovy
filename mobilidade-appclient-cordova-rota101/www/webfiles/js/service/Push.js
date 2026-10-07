class Push {

    constructor() {

        this.token = null;
        const _that = this;

        this.push = PushNotification.init({
            "android": {
                "senderID": "834472357017",
                "vibrate": true,
                "badge": true,
                "sound": true,
                "forceShow": true
            },
            "ios": {
                "badge": true,
                "sound": true,
                "alert": true
            },
            "windows": {}
        });

        this.push.on('registration', function (data) {
            _that.token = data.registrationId;
            Session.set("token", _that.token);
        });

        this.push.on('error', (e) => {
            console.log(e);
        });

        this.observerActions();

        this.callbacks = {};

        this.eventPush();
    }

    addEvent(name, callback) {
        this.callbacks[name] = callback;
    }

    observerActions() {
        this.push.on('helloWorld', data => {
            alert('I should email my guests');
        });
    }

    getToken() {
        return this.token;
    }

    eventPush() {
        this.push.on('notification', (data) => {
            if (data.additionalData.action)
                if (this.callbacks[data.additionalData.action] !== undefined)
                    this.callbacks[data.additionalData.action](data);
        });

    }
}
