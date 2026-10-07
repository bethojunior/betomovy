class PartnerBalanceController {
    static financialTransactions(customerId,date_interval,page,flow) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("PartnerBalance/FinancialTransactions", "POST",
                {customerId,date_interval,page,flow}, resolve, reject,false)
        });
    }

    static lastTransactions(customerId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("PartnerBalance/LastTransactions", "POST",
                {customerId}, resolve, reject,false)
        });
    }
    static  withdraw(customerId,value){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("PartnerBalance/Withdraw","POST",{customerId,value},
                resolve,reject,false)
        })
    }
}
