class AddressController {
    static insert(address, latitude, longitude) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("address", "POST", {address, latitude, longitude}, resolve, reject, true);
        })
    }

    static getList(address = '',page= 1 ) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`address?q=${address}&page=${page}`, "GET", null, resolve, reject, true);
        })
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`address/${id}`, "DELETE", null, resolve, reject, true)
        });
    }

    static cacheAddress(query) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`address/cache`, "POST", {query}, resolve, reject, true);
        });
    }
}