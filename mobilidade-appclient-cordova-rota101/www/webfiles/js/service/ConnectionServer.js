class ConnectionServer {
    static Host() {
        return environment.hosts.hostRequest;
    }

    /**
     *
     * @param url
     * @param method
     * @param params
     * @param callback
     * @param failCallback
     * @param isStdObject
     * @returns {XMLHttpRequest}
     */
    static sendRequest(url, method = "GET", params = {}, callback, failCallback, isStdObject = true) {

        const request = new XMLHttpRequest();

        request.onload = function () {
            Session.delete("history")
        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                switch (request.status) {
                    case 401 : {
                        ConnectionServer.sessionExpired();
                        break;
                    }
                    case 200 : {
                        ConnectionServer.hiddenMessageConnection();
                        if (callback)
                            callback(JSON.parse(this.responseText));
                        break;
                    }
                    default : {
                        if (failCallback)
                            failCallback();
                    }
                }
            }
        };
        request.open(method, ConnectionServer.Host() + url,true);

        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
        request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
        request.setRequestHeader('version', Session.get("version"));
        request.setRequestHeader('platform', device.platform);

        request.send(ConnectionServer.prepareRequest(params, isStdObject));

        return request;

    }

    static sessionExpired() {
        SwalCustom.messageDialog("Sessão expirada", "Ops", () => {
            Session.delete("user");
            Route.redirect("Main", "Login");
        }, "info");
    }

    static prepareData(method, params, isStdObject) {
        const headers = method !== "GET" ? {
            'Content-type': 'application/json',
            'token': Session.getValueInSession('user', 'api_token'),
            'userid': Session.getValueInSession('user', 'idUser')
        } : {
            'Content-type': 'application/x-www-form-urlencoded',
            'token': Session.getValueInSession('user', 'api_token'),
            'userid': Session.getValueInSession('user', 'idUser')
        };

        const data = {
            method: method,
            headers: new Headers(headers)
        };

        if (method === "POST")
            data.body = ConnectionServer.prepareRequest(params, isStdObject);

        return data;
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
            request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
            request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
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

    static hiddenMessageConnection(){
        viewController.elementProperty.removeClass(".container-connection-internet", "active");
    }
}

async function requestApi(url, data) {
    return await fetch(url, data);
}
