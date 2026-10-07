class MenuLinkExternalController extends ConnectionServer {

    static getActiveApp() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('menuApp', 'GET', {}, resolve, undefined, true);
        })
    }

    static getTypeMenuApp() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('menuApp/types', 'GET', {}, resolve, undefined, true);
        })
    }

    static createNewPublicity(data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('menuApp', 'POST', data, resolve, undefined, true);
        })
    }

    static delete(id) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`menuApp/${id}/disable`, 'PUT', {}, resolve, undefined, true);
        })
    }
}