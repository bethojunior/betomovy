class Push {

    constructor() {
        this.events = {};
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
                "badge": "true",
                "sound": "true",
                "alert": "true"
            },
            "windows": {}
        });

        this.push.on('registration', function (data) {
            _that.token = data.registrationId;
            Session.set("tokenPush", data.registrationId);
        });

        this.push.on('notification', data => {
            if (data.additionalData) {
                if (!data.additionalData.action)
                    return;

                if (_that.events[data.additionalData.action] !== undefined) {
                    _that.events[data.additionalData.action](data);
                } else {
                    PushCache[data.additionalData.action] = data;
                }
            }
        });
        this.push.on('error', (e) => {
            // e.message
        });

    }

    getToken() {
        return this.token;
    }

    addEvent(event, callback) {
        this.events[event] = callback;
    }
}

const PushCache = {};

function verifyPushCache(event, callback) {
    if (PushCache[event]) {
        callback(PushCache[event]);
        delete PushCache[event];
    }
}

const pushEvent = new Push();
