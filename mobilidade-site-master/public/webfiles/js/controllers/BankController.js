class BankController{
    async getAll(callback){
        await apis.bankGetAll().then(res => {
            callback(res.data)
        }).catch(err => {
            console.log(err)
        }) 
    }
}