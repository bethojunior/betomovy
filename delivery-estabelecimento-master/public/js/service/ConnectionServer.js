class ConnectionServer {
    static Host() {
        return HOSTS.api;
    }

    /**
     * @param url
     * @param method
     * @param params
     * @param callback
     */
    static sendRequestApi(url, method = "GET", params = null, callback = undefined) {

        console.log('aqui');

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {

                switch (request.status) {
                    case 401 : {
                        ConnectionServer.sessionExpired();
                        break;
                    }
                    case 200 : {
                        if (callback)
                            callback(JSON.parse(this.responseText));
                        break;
                    }
                    default : {
                        //ConnectionServer.sessionExpired();
                    }
                }
            }
        };
        request.open(method,this.Host()+url);
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.send(ConnectionServer.prepareRequest(params, false));
    }

    /**
     *
     * @param url
     * @param method
     * @param formData
     * @returns {Promise<any>}
     */

    static sendRequestWithFiles(url, method = "GET", formData) {
        let path = ConnectionServer.Host();

        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200 || request.status === 201 || request.status === 400 || request.status === 401) {
                        resolve(JSON.parse(request.responseText));
                    } else {
                        resolve(JSON.parse(request.responseText));
                    }
                }
            };
            request.open(method, path + url, true);
            request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
            request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
            request.send(formData);
        });
    }


    /**
     *
     * @param url
     * @param method
     * @param formData
     * @returns {Promise<any>}
     */

    static sendRequestWithFilesMain(url, method = "GET", formData) {
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            request.open(method, this.Host() + url, true);
            request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
            request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
            request.send(formData);
        });
    }

    /**
     *
     * @param url
     * @param method
     * @param params
     * @param callback
     * @param reject
     * @param v2
     */
    static sendRequest(url, method = "GET", params = null, callback = undefined, reject = undefined, v2 = false) {
        let path = ConnectionServer.Host();
        if (v2)
            path = environment.hosts.hostRequestNew;

        const request = new XMLHttpRequest();

        request.timeout = 30000;

        request.onreadystatechange = function () {
            if (request.readyState === 4) {

                try {
                    const data = JSON.parse(this.responseText);

                    switch (request.status) {
                        case 401 : {
                            reject(data);
                            if (v2)
                                SwalCustom.messageDialog(data.response, data.message, "info").then(() => {
                                    ConnectionServer.sessionExpired();
                                });
                            break;
                        }
                        case 400 : {
                            if (callback)
                                callback(data);
                            break;
                        }
                        case 200 : {
                            if (callback)
                                callback(data);
                            break;
                        }
                        case 201 : {
                            if (callback)
                                callback(data);
                            break;
                        }
                        case 404 : {
                            if (callback)
                                callback(data);
                            break;
                        }
                        case 500 : {
                            if (callback)
                                callback(data);
                            break;
                        }
                    }
                } catch (error) {
                    Toastr.error("Ocorreu um erro na comunicação com servidor");
                }
            }
        };
        request.open(method, path + url);

        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.setRequestHeader('cityid', Session.getValueInSessionLocal("citySelected", "cityId"));

        if (params) {
            request.send(ConnectionServer.prepareRequest(params, false));
        } else {
            request.send();
        }
    }

    static prepareRequest(params, isStdObject) {
        if (!isStdObject)
            return JSON.stringify(params);

        if (!Array.isArray(params)) {
            params = [params];
        }
        return JSON.stringify({stdObject: params});
    }

    static sessionExpired() {
        preload(false);
        SwalCustom.messageDialog("Sessão expirada", "Faça o login com suas credenciais", "info").then(() => {
            Session.delete("user");
            location.href = "/";
        });
    }


    static sendRequestCustomer(url, method = "GET", params = null, callback = (response) => {
    }, reject = () => {
    }) {

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                switch (request.status) {
                    case 401 : {
                        ConnectionServer.sessionExpired();
                        break;
                    }
                    case 200 : {
                        if (callback)
                            callback(JSON.parse(this.responseText));
                        break;
                    }
                    default : {
                        reject("problemas com internet");
                    }
                }
            }
        };
        request.open(method, url);

        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.send(ConnectionServer.prepareRequest(params, false));

    }

    static createGets(search) {
        return Object.keys(search).filter((attribute) => {
            return search[attribute] !== null;
        }).map((attribute) => {
            return `${attribute}=${search[attribute]}`;
        }).join("&");
    }

    /**
     *
     * @param url
     * @param method
     * @param params
     * @param callback
     * @param reject
     * @param isStdObject
     */
    static sendRequestMain(url, method = "GET", params = null, callback = undefined, reject = undefined, isStdObject = true) {

        const request = ConnectionServer.createRequest(callback, reject);

        request.open(method, environment.hosts.hostRequestApi + url);

        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.setRequestHeader('cityid', Session.getValueInSessionLocal("citySelected", "cityId"));
        request.send(ConnectionServer.prepareRequest(params, isStdObject));

    }

    static createRequest(callback, reject) {
        const request = new XMLHttpRequest();

        request.timeout = 10000;

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                //console.log(request);
                switch (request.status) {
                    case 404:
                    case 405: {
                        reject(JSON.parse(this.responseText));
                        break;
                    }
                    case 400 : {
                        callback(JSON.parse(this.responseText));
                        break;
                    }

                    case 401 : {
                        ConnectionServer.sessionExpired();
                        break;
                    }
                    case 201:
                    case 200 : {
                        if (callback)
                            callback(JSON.parse(this.responseText));
                        break;
                    }
                    default : {
                        if (reject)
                            reject("problemas com internet");
                    }
                }
            }
        };

        return request;
    }
}
