class DriverController {

    authenticate(user) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/Authenticate', 'POST', user, resolve, reject);
        })
    }

    statusApp(appIsOpen) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/StatusApp', 'POST', {appIsOpen}, resolve, reject, undefined, false);
        })
    }

    searchTrip(driverId, listTripsDenied, location) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/searchTrip', 'POST', {
                driverId,
                listTripsDenied,
                location
            }, resolve, reject);
        });
    }

    findWithAccountInfo(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/FindWithAccountInfo', 'POST', {driverId}, resolve, reject);
        });
    }

    defaultStation(driverId, stationId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/DefaultStation', 'POST', {driverId, stationId}, resolve, reject);
        });
    }

    acceptTrip(tripReference, driverId, estimatedTimeDriverArrival, distanceDriverArrival) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/AcceptTrip', 'POST', {
                driverId: parseInt(driverId),
                tripReference,
                estimatedTimeDriverArrival,
                distanceDriverArrival
            }, resolve, reject);
        });
    }

    toggleStatus(driverId, status, location) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/ToggleStatus', 'POST', {driverId, status, location}, resolve, reject);
        })
    }

    cancelTrip(cancelTrip) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/CancelTrip', 'POST', cancelTrip, resolve, reject);
        });
    }

    informArrival(tripReference) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/InformArrival', 'POST', {tripReference}, resolve, reject);
        });
    }

    initTrip(tripReference) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/InitTrip', 'POST', {tripReference}, resolve, reject);
        });
    }

    finishTrip(tripReference) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/FinishTrip', 'POST', {tripReference}, resolve, reject, 5000);
        });
    }

    finishTripOffline(tripReference, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/FinishTrip', 'POST', {tripReference, data}, resolve, reject);
        });
    }

    find(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/Find', 'POST', {driverId}, resolve, reject);
        });
    }

    sendConfirmationCode(number) {
        return true;
    }

    getTripsById(driverId, page, date = null, status = null) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/GetTrips', 'POST', {driverId, page, date, status}, resolve)
        })
    }

    static checkPassword(password) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/CheckPassword', 'POST', {password}, resolve, reject, undefined, false);
        });
    }

    static getCodeVerify(email) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/ForgotPassword', 'POST', {email}, resolve);
        });
    }

    static updatePasswordById(email, password) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/ChangePassword', 'POST', {email, password}, resolve);
        });
    }

    static updateDataDriver(driver) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/Edit', 'POST', {
                ...driver
            }, resolve);
        });
    }

    static updatePhoto(driverId, photo) {

        return new Promise(resolve => {

            const formData = new FormData();

            FileUpload.prepare(photo).then(file => {

                formData.append("photo", file.data, file.name);
                formData.append("driverId", driverId);

                ConnectionServer.sendRequestWithFiles("Driver/EditProfileImage", "POST", formData).then(resolve);

            });

        });
    }

    /**
     *
     * @param email
     * @returns {Promise<any>}
     */
    checkEmail(email) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/CheckEmail', 'POST', {email}, resolve);
        });
    }

    updateVersion(driverId, driverAppVersion, deviceToken) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/UpdateVersion', 'POST', {
                    driverId,
                    driverAppVersion,
                    deviceToken
                }, resolve, reject,
                undefined, false);
        })
    }

    static checkCpf(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/CheckDocument', 'POST', data, resolve, reject, undefined, false);
        });
    }

    putPreAvailable() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/PutPreAvailable', 'POST', {}, resolve, reject);
        });
    }

    static confirmWaypoint(idWayPoint) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/ConfirmWaypoint', 'POST', {idWayPoint}, resolve, reject, undefined, false);
        });
    }

    static indication(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/Indication', 'POST', data, resolve, reject, undefined, false);
        });
    }

    register(driver) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            formData.append("stdObject", JSON.stringify(driver));


            Promise.all([
                new Promise(resolve1 => {
                    formData.append("PROFILE", driver.image.PROFILE.data, driver.image.PROFILE.name);

                    resolve1();
                }),
                ...driver.image.DOCUMENTS.map(item => {
                    return new Promise(resolve1 => {
                        formData.append(`DOC_${item.docId}`, item.image.data, item.image.name);

                        resolve1();
                    })
                })])
                .then(() => {
                    ConnectionServer.sendRequestWithFilesMain("Driver/Register", "POST", formData)
                        .then(resolve)
                        .catch(reject);
                });

        });
    }
}
