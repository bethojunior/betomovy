class RequiredFieldController {
    static get(userTypeId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`requiredfield/get?userTypeId=${userTypeId}`,'GET',
                null,resolve,reject,undefined,false)
        });
    }
}