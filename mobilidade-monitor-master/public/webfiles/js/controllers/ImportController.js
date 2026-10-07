class ImportController {
    static getExampleCustomer() {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        if (request.response.type === "application/json")
                            return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");

                        const blob = this.response;

                        const contentTypeHeader = request.getResponseHeader("Content-Type");

                        resolve({blob, contentTypeHeader});

                    }

                    if (request.status === 404) {
                        return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");
                    }
                }
            };
            request.open('GET', `${environment.hosts.hostRequestNew}import/customer/example`);
            request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
            request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.responseType = 'arraybuffer';
            request.send(ConnectionServer.prepareRequest(null, false));
        })
    }

    static importClient(file) {
        const formData = new FormData();
        formData.append("file", file);
        return ConnectionServer.sendRequestWithFiles("import/customer", "POST", formData, true);
    }

    static getExampleDriver() {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        if (request.response.type === "application/json")
                            return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");

                        const blob = this.response;

                        const contentTypeHeader = request.getResponseHeader("Content-Type");

                        resolve({blob, contentTypeHeader});

                    }

                    if (request.status === 404) {
                        return SwalCustom.messageDialog("", "Ocorreu um erro ao emitir relatório");
                    }
                }
            };
            request.open('GET', `${environment.hosts.hostRequestNew}import/driver/example`);
            request.setRequestHeader('token', Session.getValueInSession('user', 'api_token'));
            request.setRequestHeader('userid', Session.getValueInSession('user', 'idUser'));
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.responseType = 'arraybuffer';
            request.send(ConnectionServer.prepareRequest(null, false));
        })
    }

    static importDriver(file, userTypeId, cityId) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userTypeId", userTypeId);
        formData.append("cityId", cityId);
        return ConnectionServer.sendRequestWithFiles("import/driver", "POST", formData, true);
    }
}