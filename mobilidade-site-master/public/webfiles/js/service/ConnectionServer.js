class ConnectionServer {
    static Host(isV2) {
        return isV2 ? HOST_API_V2 : HOST_API;
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
    }, reject, timeRequest, isStdObject = true) {

        const data = ConnectionServer.prepareData(method, params, isStdObject);

        if (timeRequest !== undefined) {
            ConnectionServer.timeRequest(timeRequest, url, data, callback, reject);
            return;
        }

        fetch(ConnectionServer.Host() + url, data)
            .then(result => {

                if (result.status === 401) {
                    /*swal("Sessão expirada","Ops","info").then(()=>{
                        Session.delete("user");
                        location.reload();
                    });
                    return;*/
                }

                return result.json()
            })
            .then(data => {
                callback(data)
            })
            .catch(error => {
                //Log.write(url + " " + error, level.SISTEMA, logType.PROCESS, params);

                if (reject !== undefined)
                    reject();
            })
    }

    static sendRequestV2(path, method = "GET", params = null) {
        return new Promise((resolve, reject) => {
            const request = ConnectionServer.createRequest(resolve, reject);
            request.open(method, `${ConnectionServer.Host(true)}${path}`);
            request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            request.setRequestHeader('token',  Session.getValueInSession('user','api_token'));
            request.setRequestHeader('userid',  Session.getValueInSession('user','idUser'));
            request.send(ConnectionServer.prepareRequest(params, false));
        });
    }

    static prepareData(method, params, isStdObject) {
        const headers = method !== "GET" ? {
            'Content-type': 'text/plain',
            'Accept': 'text/plain',
            'token': Session.getValueInSession('user','api_token'),
            'userid': Session.getValueInSession('user','idUser')
        } : {
            'Content-type': 'application/x-www-form-urlencoded',
            'token': Session.getValueInSession('user','api_token'),
            'userid': Session.getValueInSession('user','idUser')
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
                // Log.write(url + " " + error.message, level.SISTEMA, logType.PROCESS, null);

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


    static sendRequestWithFilesMain(url, method = "GET", formData) {
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            request.open(method, ConnectionServer.Host() + url, true);
            request.send(formData);
        });
    }


    static sendRequestWithFiles(url, method = "GET", formData) {
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            request.open(method, ConnectionServer.Host() + url, true);
            //request.setRequestHeader('token',Session.getValueInSession('user','api_token'));
            //request.setRequestHeader('userid',Session.getValueInSession('user','idUser'));
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

        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            request.open(method, ConnectionServer.Host() + url, true);
            //request.setRequestHeader('token', //.getValueInSession('user', 'api_token'));
            //request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
            request.send(formData);
        });
    }


    static request(url, method = "POST", params, std = false, resolve) {
        $.ajax({
            url: this.Host() + url,
            method: method,
            data: this.prepareRequest(params, true),
            success: function (res) {
                resolve(res)
            }
        })
    }

    static requestEmail(url, method = "POST", params, std = false, resolve) {
        $.ajax({
            url: this.Host() + url,
            method: method,
            data: this.prepareRequest(params, false),
            success: function (res) {
                resolve(res)
            }
        })
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
