class RouteController extends ConnectionServer {
    static get({lat, lng}) {
        return new Promise(((resolve, reject) => {
            this.sendRequest(`Route/Get?lat=${lat}&lng=${lng}`, 'GET', null, resolve, reject)
        }))
    }

    static getRouteDriverAccepted() {
        return new Promise(((resolve, reject) => {
            this.sendRequest(`RouteDriverAccepted/Get`, 'GET', null, resolve, reject)
        }))
    }

    static use(routeId) {
        return new Promise(((resolve, reject) => {
            this.sendRequest(`Route/Use`, 'POST', {routeId}, resolve, reject, undefined, false);
        }))
    }
}