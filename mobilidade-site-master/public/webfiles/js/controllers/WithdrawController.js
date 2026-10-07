class WithdrawController {
    actionNew(driverId,value){
        return new Promise((resolve,reject ) =>{
            ConnectionServer.sendRequest('Withdraw/New', 'POST', {driverId,value}, resolve,reject);
        });
    }
    actionFind(confirmationCode){
        return new Promise((resolve,reject ) =>{
            ConnectionServer.sendRequest('Withdraw/Find', 'POST', {confirmationCode}, resolve,reject);
        });
    }
}