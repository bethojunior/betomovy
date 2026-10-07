class FavoriteDriverController {
    static listCustomer(driverId,page){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("FavoriteDriver/listCustomers","POST",
                {driverId,page},resolve,reject,undefined,false);
        });
    }

    static blockCustomer(customerId){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("FavoriteDriver/blockCustomer","POST",
                {customerId},resolve,reject,undefined,false);
        });
    }

    static delete(idFavorite){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("FavoriteDriver/delete","POST",
                {idFavorite},resolve,reject,undefined,false);
        });
    }
}