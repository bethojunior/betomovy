class additionalAppSettingsController extends ConnectionServer {
    static getSettings() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('config/additional', 'GET', {}, resolve, undefined, true)
        });
    }
}
