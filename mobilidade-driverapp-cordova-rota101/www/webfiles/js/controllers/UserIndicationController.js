class UserIndicationController {
    static getIndicated(page=1){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`userindication/getIndicated?page=${page}`,"GET",null,resolve,reject);
        });
    }
}