class AddressBlacklistController {
    static get() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`addressBlacklist`, "GET", null, resolve, reject, true);
        });
    }

    static approve(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`addressBlacklist/${id}/approve`, "PUT", null, resolve, reject, true);
        });
    }

    static refuse(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`addressBlacklist/${id}/refuse`, "PUT", null, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`addressBlacklist/${id}`, "DELETE", null, resolve, reject, true);
        });
    }

    static insert({address, latitude, longitude}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`addressBlacklist`, "POST", {
                address,
                latitude,
                longitude
            }, resolve, reject, true);
        });
    }
}