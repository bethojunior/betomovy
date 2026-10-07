class BankController {
    getAll(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Bank/GetAll","POST",{},resolve,reject);
        });
    }
}