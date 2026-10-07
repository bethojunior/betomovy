class Position {

    constructor() {
        this.currentPosition = null;
        this.lastPosition = null;
    }

    getCurrent(callback = function () {
    }) {

        const _that = this;
        gpsDetect.checkGPS(function (enabled) {
            if (enabled) {
                navigator.geolocation.getCurrentPosition(result => {

                    _that.lastPosition = _that.currentPosition;

                    _that.currentPosition = {lat: result.coords.latitude, lng: result.coords.longitude};

                    callback(_that.currentPosition);
                });
                return;
            }

            SwalCustom.messageDialog("Por favor, habilite o seu gps !", "Não foi possível obter sua localização", function () {
                _that.getCurrent(callback)
            });
        });

    }

    static getCurrentMap(callback = function () {
    }) {
        const _that = this;
        gpsDetect.checkGPS(function (enabled) {
            if (enabled) {
                navigator.geolocation.getCurrentPosition(result => {

                    _that.lastPosition = _that.currentPosition;

                    _that.currentPosition = {lat: result.coords.latitude, lng: result.coords.longitude};

                    callback(_that.currentPosition);
                }, function (err) {
                    console.log(err)
                });
                return;
            }

            SwalCustom.messageDialog("Por favor, habilite o seu gps !", "Não foi possível obter sua localização", function () {
                Position.getCurrentMap(callback)
            });
        });

    }


    waitPositionCurrent(callback = function () {
    }) {
        const _that = this;
        navigator.geolocation.watchPosition(result => {
            _that.lastPosition = _that.currentPosition;

            _that.currentPosition = {lat: result.coords.latitude, lng: result.coords.longitude};

            callback(_that.currentPosition);
        }, function () {
            console.log("error na localização")
        }, {enableHighAccuracy: true});
    }

    getDistanceFromLatLonInMeters() {
        if (this.lastPosition === null)
            return;
        if (this.currentPosition === null)
            return;


        let deg2rad = function (deg) {
                return deg * (Math.PI / 180);
            },
            R = 6371,
            dLat = deg2rad(this.lastPosition.lat - this.currentPosition.lat),
            dLng = deg2rad(this.lastPosition.lng - this.currentPosition.lng),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(this.currentPosition.lat))
                * Math.cos(deg2rad(this.currentPosition.lat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseInt((R * c * 1000).toFixed());
    }
}