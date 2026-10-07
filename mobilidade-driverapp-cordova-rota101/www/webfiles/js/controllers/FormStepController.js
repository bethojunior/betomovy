class FormStepController {
    static getByUserType(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`FormStep/GetByUserType?userTypeId=${id}`, "GET", null, resolve, reject);
        })
    }
}