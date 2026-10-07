class BankAccountController {
    insert(account){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("BankAccount/Insert","POST",account,resolve,reject);
        });
    }
    edit(account){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("BankAccount/Edit","POST",account,resolve,reject);
        });
    }
}