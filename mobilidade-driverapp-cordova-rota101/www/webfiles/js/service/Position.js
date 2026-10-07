class Position {

    constructor() {
        this.currentPosition = null;
        this.lastPosition = null;
        this.watchPosition = null;
    }

    getCurrent(resolve, reject, time = 5000) {
        this.verifyGps().then(() => {
            clearTimeout(this.watchPosition);

            const _that = this;

            (function getPosition() {
                BackgroundGeolocation.getCurrentLocation(resolve,
                    err => {
                        if (controllerMeter.gpsIsActive)
                            requestPermissionLocation();
                        reject();
                    }, {
                        enableHighAccuracy: true
                    });

                _that.watchPosition = setTimeout(getPosition, time);
            })();
        }).catch(() => {
            SwalCustom.messageDialog("Por favor, habilite o seu gps !", "Não foi possível obter sua localização", function () {
                reject();
            });
        });

    }

    verifyGps() {
        return new Promise((resolve, reject) => {
            gpsDetect.checkGPS(function (enabled) {
                if (enabled) {
                    resolve();
                    return;
                }
                reject();
            });
        })
    }

    static getCurrentMap() {
        return new Promise((resolve, reject) => {
            gpsDetect.checkGPS((enabled) => {
                controllerMeter.gpsIsActive = enabled;

                if (enabled) {

                    return plugin.google.maps.LocationService.getMyLocation({
                        enableHighAccuracy: true
                    }, (position) => {
                        const {latLng: {lat, lng}} = position;

                        resolve({lat, lng});
                    }, reject);
                }

                SwalCustom.messageDialog("Por favor, habilite o seu gps !", "Não foi possível obter sua localização", function () {
                    reject("GPS desativado");
                });
            });
        });

    }

    getDistanceLocation(location1, location2) {

        let deg2rad = function (deg) {
                return deg * (Math.PI / 180);
            },
            R = 6371,
            dLat = deg2rad(location1.lat - location2.lat),
            dLng = deg2rad(location1.lng - location2.lng),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(location2.lat))
                * Math.cos(deg2rad(location2.lat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseInt((R * c * 1000).toFixed());
    }

    static getPermission() {
        isOpenRequestLocalBackground = true;
        return new Promise((resolve, reject) => {
            FloatingWidget.getPermissionLocation(
                () => {
                    if (device.platform !== "iOS") {
                        RequestIgnoreBatteryOptimizationCordova.requestPermission();
                    }

                    isOpenRequestLocalBackground = false;
                    resolve();
                },
                (result) => {
                    if (result != null) {
                        if (result.isPermissionBackground) {
                            resolve(result);
                            return;
                        }
                    }

                    viewController.elementProperty.addClass(".modal-permission-local", "active");

                    viewController.elementProperty.addEventInElement("#optionRefusedLocalBackground", "onclick", function () {
                        viewController.elementProperty.removeClass(".modal-permission-local", "active");
                        isOpenRequestLocalBackground = false;
                        Session.set("refusedLocalPermission", true, false);
                        reject();
                    });

                    viewController.elementProperty.addEventInElement("#optionAcceptedLocalBackground", "onclick", function () {
                        viewController.elementProperty.removeClass(".modal-permission-local", "active");
                        Session.delete("refusedLocalPermission");
                        navigator.geolocation.getCurrentPosition(
                            () => {
                                let timeout = null;
                                FloatingWidget.askPermissionLocation((result) => {
                                    isOpenRequestLocalBackground = false;
                                    resolve(result);
                                }, (result) => {
                                    isOpenRequestLocalBackground = false;
                                    resolve(result);
                                });

                                document.addEventListener("resume", () => {
                                    clearTimeout(timeout)
                                    setTimeout(()=>{
                                        isOpenRequestLocalBackground = false;
                                        resolve({});
                                    },1000)
                                });

                                timeout = setTimeout(()=>{
                                    isOpenRequestLocalBackground = false;
                                    resolve({});
                                },3000)

                            },
                            () => {
                                isOpenRequestLocalBackground = false;
                                resolve(result);
                            });
                    });
                });
        });
    }

    static getOpenRequestLocalBackground() {
        return isOpenRequestLocalBackground;
    }
}

let isOpenRequestLocalBackground = false;
