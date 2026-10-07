class UserRepository {
    static login(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("login","POST",data,resolve,reject,false);
        })
    }

    static register(data){
        return ConnectionServer.sendRequestWithFilesCentral("user/register","POST",data);
    }
}