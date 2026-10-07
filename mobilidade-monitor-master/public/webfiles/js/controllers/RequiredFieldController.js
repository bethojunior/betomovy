class RequiredFieldController {
    static get(userTypeId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`userType/${userTypeId}/requiredFields`,'GET',
                null,resolve,reject,true)
        });
    }
    
    static update(id, payload){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`requiredField/customer/${id}`,'PUT',
                payload,resolve,reject,true)
        });
    }
}