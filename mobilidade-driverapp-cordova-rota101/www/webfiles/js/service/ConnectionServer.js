class ConnectionServer {
    static logger = null;
    
    static getLogger() {
        if (!ConnectionServer.logger) {
            getPulseLogger().then(l => ConnectionServer.logger = l).catch(() => {});
        }
        return ConnectionServer.logger;
    }
    
    static setCommonHeaders(request, includeContentType = true) {
        if (includeContentType) {
            request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        }
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.setRequestHeader('version', Session.get("version") || '1.0.0');
        request.setRequestHeader('platform', (typeof device !== 'undefined' ? device.platform : 'Web'));
        const cityIdHeader = Session.get("cityId") || Session.getValueInSession("cityConfig", "cityId") || '1';
        request.setRequestHeader('cityid', String(cityIdHeader));
    }
    
    static setBasicHeaders(request) {
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
    }
    
    static Host() {
        return API_HOST;
    }

    /**
     *
     * @param url
     * @param method
     * @param params
     */
    static sendRequestApi(url, method = "GET", params = {}) {

        const request = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    switch (request.status) {
                        case 200 : {
                            resolve(JSON.parse(this.responseText));
                            break;
                        }
                        default : {
                            reject();
                        }
                    }
                }
            };
            request.open(method, url, true);

            request.send(ConnectionServer.prepareRequest(params, false));
        });
    }


    /**
     *
     * @param url
     * @param method
     * @param params
     * @param callback
     * @param reject
     * @param timeRequest
     * @param isStdObject
     */
    static sendRequest(url, method = "GET", params = {}, callback = function (response) {
    }, reject, timeRequest, isStdObject = true, isV2 = false) {

        const data = ConnectionServer.prepareData(method, params, isStdObject);

        if (timeRequest !== undefined) {
            ConnectionServer.timeRequest(timeRequest, url, data, callback, reject);
            return;
        }

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                switch (request.status) {
                    case 401 : {
                        SwalCustom.messageDialog("Sessão expirada", "Ops", () => {
                            Session.delete("user");
                            location.reload();
                        }, "info");
                        return;
                    }
                    case 200 : {
                        if (callback)
                            callback(JSON.parse(this.responseText));
                        break;
                    }
                    default : {
                        if (reject) {
                            let err = null;
                            try {
                                const body = request.responseText ? JSON.parse(request.responseText) : {};
                                err = { status: request.status, ...body };
                            } catch (e) {
                                err = { status: request.status };
                            }
                            reject(err);
                        }
                    }
                }
            }
        };

        const host = isV2 ? HOST_API_V2 : ConnectionServer.Host();

        request.open(method, host + url, true);
        ConnectionServer.setCommonHeaders(request);
        request.send(ConnectionServer.prepareRequest(params, isStdObject));
    }

    /**
     *
     * @param url
     * @param method
     * @param params
     * @param timeRequest
     * @param isStdObject
     * @returns {{request: XMLHttpRequest, promise: Promise<any>}}
     */
    static requestWithReturn(url, method = "GET", params = {}, timeRequest, isStdObject = true) {

        const request = new XMLHttpRequest();

        return {
            request, promise: new Promise((resolve, reject) => {

                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        switch (request.status) {
                            case 401 : {
                                SwalCustom.messageDialog("Sessão expirada", "Ops", () => {
                                    Session.delete("user");
                                    location.reload();
                                }, "info");
                                return;
                            }
                            case 200 : {
                                resolve(JSON.parse(this.responseText));
                                break;
                            }
                            default : {
                                if (reject)
                                    reject();
                            }
                        }
                    }
                };
                request.open(method, ConnectionServer.Host() + url, true);
                ConnectionServer.setCommonHeaders(request);
                request.send(ConnectionServer.prepareRequest(params, isStdObject));
            })
        };
    }

    static prepareData(method, params, isStdObject) {
        const headers = method !== "GET" ? {
            'Content-type': 'application/json',
            'token': Session.getValueInSession('user', 'api_token'),
            'userid': Session.getValueInSession('user', 'idUser'),
            'mptoken': Session.get("mptoken")
        } : {
            'Content-type': 'application/x-www-form-urlencoded',
            'token': Session.getValueInSession('user', 'api_token'),
            'userid': Session.getValueInSession('user', 'idUser'),
            'mptoken': Session.get("mptoken")
        };

        const data = {
            method: method,
            headers: new Headers(headers)
        };

        if (method === "POST")
            data.body = ConnectionServer.prepareRequest(params, isStdObject);

        return data;
    }

    static timeRequest(timeRequest, url, data, callback, reject) {
        this.timeout(timeRequest, fetch(ConnectionServer.Host() + url, data))
            .then(result => result.json())
            .then(data => {
                callback(data)
            })
            .catch((error) => {
                Log.write(url + " " + error.message, level.SISTEMA, logType.PROCESS, null);

                if (reject !== undefined)
                    reject(error);
            });
    }

    static timeout(ms, promise) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error("Problemas com conexão de internet"), true);
            }, ms);
            promise.then(resolve, reject)
        })
    }


    static sendRequestWithFiles(url, method = "GET", formData) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            ConnectionServer.getLogger();
            
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        try {
                            resolve(JSON.parse(request.responseText));
                        } catch (e) {
                            if (ConnectionServer.logger) ConnectionServer.logger.error(`Erro parse JSON: ${e.message}`);
                            reject(e);
                        }
                    } else {
                        if (ConnectionServer.logger) ConnectionServer.logger.error(`HTTP ${request.status}: ${url}`);
                        reject(new Error(`HTTP ${request.status}`));
                    }
                }
            };
            
            request.open(method, ConnectionServer.Host() + url, true);
            ConnectionServer.setBasicHeaders(request);
            request.send(formData);
        });
    }

    static prepareRequest(params, isStdObject) {
        if (!isStdObject)
            return JSON.stringify(params);

        if (!Array.isArray(params)) {
            params = [params];
        }
        return JSON.stringify({stdObject: params});
    }

    static sendFile(url, method = "GET", formData) {
        return ConnectionServer.sendRequestWithFiles(url, method, formData);
    }

    static requestApi(url, method = "GET", params = {}, callback = undefined, reject = undefined) {

        const data = ConnectionServer.prepareData(method, params, false);

        fetch(url, data)
            .then(result => {
                return result.json()
            })
            .then(data => {
                if (callback)
                    callback(data)
            })
            .catch(error => {
                if (reject)
                    reject(error);
            })
    }

    static sendRequestNative(url, method, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                data,
                url,
                headers: {
                    'token': Session.getValueInSession('user', 'api_token'),
                    'userid': Session.getValueInSession('user', 'idUser'),
                }
            };

            switch (method) {
                case "post": {
                    HttpRequestCordova.post(options, resolve, reject);
                    break;
                }
                case "get": {
                    HttpRequestCordova.get(options, resolve, reject);
                    break;
                }
            }
        });
    }

        /**
         * 
         * @param url
         * @param method
         * @param params
         * @param callback
         * @param reject
         * @param timeRequest
         * @param isStdObject
         */
        static sendRequestCentral(url, method = "POST", params = {}, callback = function (response) {
        }, reject, isStdObject = false) {
            
            const request = new XMLHttpRequest();
    
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    switch (request.status) {
                        case 401: {
                            SwalCustom.messageDialog("Sessão expirada", "Ops", () => {
                                Session.delete("user");
                                location.reload();
                            }, "info");
                            return;
                        }
                        case 200: {
                            if (callback)
                                callback(JSON.parse(this.responseText));
                            break;
                        }
                        default: {
                            if (reject)
                                reject();
                        }
                    }
                }
            };
    
            request.open(method, API_HOST_CENTRAL + url, true);
            ConnectionServer.setCommonHeaders(request);
            request.send(ConnectionServer.prepareRequest(params, isStdObject));
        }
    
}
