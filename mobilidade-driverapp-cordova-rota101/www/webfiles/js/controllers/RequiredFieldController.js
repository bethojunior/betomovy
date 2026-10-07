class RequiredFieldController {
    static get(userTypeId, fullFields = 0){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`requiredfield/get?userTypeId=${userTypeId}&fullFields=${fullFields}`,'GET',
                null,resolve,reject,undefined,false)
        });
    }
}