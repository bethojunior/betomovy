class RulesController {
    static actionGetAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("role", "GET", null, resolve, reject, true);
        })
    }

    static actionPermissions() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("role/permissions", "GET", null, resolve, reject, true);
        });
    }

    static actionRole(name, cities, permissions, support) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("role", "POST", {name, cities, permissions, support}, resolve, reject, true);
        });
    }


    static editRole(id,name, permissions, support) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/${id}`, "PUT", {name, permissions, support}, resolve, reject, true);
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static get(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/${id}`, "GET", null, resolve, reject, true);
        });
    }

    static addCity(id, cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/${id}/city`, "POST", {cityId}, resolve, reject, true);
        })
    }

    static removeCity(id, cityId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`role/${id}/city/${cityId}`, "DELETE", null, resolve, reject, true);
        })
    }
}