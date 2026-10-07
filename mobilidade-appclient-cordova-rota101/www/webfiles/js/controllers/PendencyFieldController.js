class PendencyFieldController {
    static check() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`PendencyField/Check`, 'GET', null, resolve, reject);
        });
    }
}