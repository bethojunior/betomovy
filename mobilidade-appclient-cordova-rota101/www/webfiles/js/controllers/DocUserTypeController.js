class DocUserTypeController {
    static findByUserType(userTypeId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`DocUserType/FindByUserType?userTypeId=${userTypeId}`, 'GET', null, resolve, reject);
        })
    }
}
