class FormStepController {
    static getByUserType(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`FormStep/GetByUserType?userTypeId=${id}`, "GET", null, resolve, reject);
        })
    }
}