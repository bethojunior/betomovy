class RouteController extends ConnectionServer {
    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static createRoute(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest("route", "POST", data, resolve, null, true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static listTripItem() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "deliveryInfoSuggestion",
                "GET",
                "",
                resolve,
                null,
                true
            );
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static listRoutes() {
        return new Promise(resolve => {
            this.sendRequest("route?cityId=" + Session.getValueInSessionLocal("citySelected", "cityId"),
                "GET", null, resolve, null, true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteRoute(id) {
        return new Promise(resolve => {
            this.sendRequest("route/" + id, "DELETE", null, resolve, null, true);
        });
    }

    /**
     *
     * @param status
     * @param id
     * @returns {Promise<unknown>}
     */
    static releaseRoute(status, id) {
        if (status === "enable") {
            return new Promise(resolve => {
                this.sendRequest(
                    `route/${id}/enable`,
                    "PUT",
                    null,
                    resolve,
                    null,
                    true
                );
            });
        }
        return new Promise(resolve => {
            this.sendRequest(`route/${id}/disable`, "PUT", null, resolve, null, true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static listReleaseDriverRoute() {
        return new Promise(resolve => {
            this.sendRequest("routeDriverAccepted", "GET", null, resolve, null, true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static enableDriverInRoute(id) {
        return new Promise(resolve => {
            this.sendRequest(
                `routeDriverAccepted/${id}/enable`,
                "PUT",
                null,
                resolve,
                null,
                true
            );
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static disableDriverInRoute(id) {
        return new Promise(resolve => {
            this.sendRequest(
                `routeDriverAccepted/${id}`,
                "DELETE",
                null,
                resolve,
                null,
                true
            );
        });
    }

    static routePitStopType() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('routePitStopType', 'GET', null, resolve, reject, true)
        });
    }

    static delete(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`route/${id}`, 'DELETE', null, resolve, reject, true)
        });
    }

    static getDataToEditRoute(id) {
        return new Promise (resolve => {
            ConnectionServer.sendRequest(`route/${id}`, 'GET', id, resolve, undefined, true);
        });
    }

    static updateRoute(id, data) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`route/${id}`, 'PUT', data, resolve, undefined, true);
        });
    }
}
