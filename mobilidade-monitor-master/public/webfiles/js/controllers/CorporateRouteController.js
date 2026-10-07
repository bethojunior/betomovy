class CorporateRouteController {
    static companies(routeId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`corporateRoute/${routeId}/companies`, "GET", null, resolve, reject, true);
        })
    }

    static insert(routeId, companyId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`corporateRoute`, "POST", {routeId, companyId}, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`corporateRoute/${id}`, "DELETE", null, resolve, reject, true);
        })
    }
}