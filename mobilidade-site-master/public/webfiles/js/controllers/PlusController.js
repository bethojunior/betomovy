class PlusController {
    static preRegister(data){
        return new Promise((resolve , reject) => {
            ConnectionServer.sendRequest('Marketing/PreRegisterDriver' , 'POST' , data , resolve , reject , '' , false);
        });
    }
}