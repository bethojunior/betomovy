class AddressBlacklistController {
    static insert(addresses) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("AddressBlacklist/Insert", "POST", {addresses}, resolve, reject, undefined, false);
        })
    }

    static riskArea({userId,latitude,longitude,address,tripReference}){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("riskArea/store", "POST", {userId,latitude,longitude,address,tripReference}, resolve, reject, undefined, false);
        })
    }
}
