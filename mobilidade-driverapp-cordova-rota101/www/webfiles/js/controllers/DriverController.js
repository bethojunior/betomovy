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

    static acceptScheduled(tripReference, driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/AcceptScheduled', 'POST', {
                driverId: parseInt(driverId),
                tripReference,
            }, resolve, reject, undefined, false);
        });
    }

    toggleStatus(driverId, status, location, cityId = null) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/ToggleStatus', 'POST', {driverId, status, location, cityId}, resolve, reject);
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

    find(driverId, showStatistics = false) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/Find', 'POST', {driverId, showStatistics}, resolve, reject);
        });
    }

    sendConfirmationCode(number) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/SendConfirmationCode', 'POST', {number}, resolve);
        })
    }

    refuseTrip(driverId, tripReference) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Driver/RefuseTrip', 'POST', {driverId, tripReference}, resolve);
        })
    }

    register(driver) {
        return new Promise((resolve, reject) => {
            const executeRegistration = (logger = null) => {
                const formData = new FormData();
                formData.append("stdObject", JSON.stringify(driver));

                viewController.elementProperty.getElement(".file-pdf", element => {
                    formData.append(`PDF_${element.getAttribute("docId")}`, element.files[0])
                });

                Promise.all([
                    new Promise(resolve1 => {
                        FileUpload.prepare(driver.image.PROFILE).then(file => {
                            formData.append("PROFILE", file.data, file.name);
                            resolve1(file);
                        }).catch(error => {
                            if (logger) logger.error(`Erro preparação PROFILE: ${error.message || error}`);
                            resolve1(null);
                        })
                    }),
                    ...driver.image.DOCUMENTS.map(item => {
                        return new Promise(resolve1 => {
                            FileUpload.prepare(item.image).then(file => {
                                formData.append(`DOC_${item.docId}`, file.data, file.name);
                                resolve1(file);
                            }).catch(error => {
                                if (logger) logger.error(`Erro preparação DOC_${item.docId}: ${error.message || error}`);
                                resolve1(null);
                            });
                        })
                    })])
                    .then(() => {
                        ConnectionServer.sendRequestWithFiles("Driver/Register", "POST", formData)
                            .then(result => {
                                if (logger && !result.status) {
                                    logger.error(`Erro no registro: ${result.message}`);
                                }
                                resolve(result);
                            })
                            .catch(error => {
                                if (logger) logger.critical(`Erro crítico: ${error.message || error}`);
                                reject(error);
                            });
                    });
            };
            
            getPulseLogger()
                .catch(() => null)
                .then(logger => executeRegistration(logger));
        });
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
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            FileUpload.prepare(photo).then(file => {
                formData.append("photo", file.data, file.name);
                formData.append("driverId", driverId);

                ConnectionServer.sendRequestWithFiles("Driver/EditProfileImage", "POST", formData)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
        });
    }


    static updateProfilePicture(userId, photo) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            FileUpload.prepare(photo).then(file => {
                formData.append("photo", file.data, file.name);
                formData.append("userId", userId);

                ConnectionServer.sendRequestWithFiles("user/changeprofile", "POST", formData)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
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
        return ConnectionServer.sendRequestNative(`${ConnectionServer.Host()}Driver/PutPreAvailable`, 'post', {});
    }

    static confirmWaypoint(idWayPoint) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/ConfirmWaypoint', 'POST', {idWayPoint}, resolve, reject, undefined, false);
        });
    }

    static findWithPendencies(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/FindWithPendencies', 'POST', {driverId}, resolve, reject, undefined, false);
        });
    }

    static weeklyEarnings(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/WeeklyEarnings', 'POST', {driverId}, resolve, reject, undefined, false);
        });
    }

    static editDocuments(form) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendFile('Driver/EditDocsImage', 'POST', form).then(resolve).catch(reject)
        });
    }

    static dataSheet(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Driver/DataSheet?driverId=${driverId}`, "GET", null, resolve, reject);
        })
    }

    static sendAppInfo(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('DriverAppInfo/SendDriverAppInfo', "POST", data, resolve, reject, undefined, false);
        })
    }

    static validateAccountBank(idDriver) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Driver/ValidateAccountConfianceBank', 'POST', {idDriver}, resolve, reject, undefined, false);
        })
    }

    excludeAccount(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('User/RemoveAccountRequest', 'POST', data, resolve, reject, undefined, false);
        })
    }

    static getTripsAvailable = (page, params = {}) => {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Driver/TripsAvailable`, 'POST', { 
                stdObject: [ { ...params, page } ]
            }, resolve, reject, undefined, false)
        });
    }

    static getTripsAccepted = (page, params = {}) => {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Driver/TripsAccepted`, 'POST', { 
                stdObject: [ { ...params, page } ]
            }, resolve, reject, undefined, false)
        });
    }

    static getTripsSummary = (params = {}) => {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Driver/TripsSummary`, 'POST', { 
                stdObject: [ params ]
            }, resolve, reject, undefined, false)
        });
    }
}
