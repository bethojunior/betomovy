class CentralUserController {
    static insert(object){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("central/user/insert","POST",object,resolve,reject, true);
        });
    }

    static get(centralId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/user/${centralId}`,"GET",null,resolve,reject, true);
        });
    }

    static removeUser(centralId,userId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`centralUser/${centralId}/user/${userId}`,"DELETE",null,resolve,reject);
        });
    }

    static removeUserById(userId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`user/${userId}/central`,"DELETE",null,resolve,reject, true);
        });
    }

    static getAllCustomers(page, name){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`customer/central?page=${page}&name=${name}`,"GET",null,resolve,reject, true);
        });
    }
}