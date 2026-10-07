class FavoriteDriverController {
    insert(customerId, driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("FavoriteDriver/Insert", "POST", {
                customerId,
                driverId
            }, resolve, reject, false);
        })
    }

    list(customerId){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("FavoriteDriver/list", "POST", {
                customerId
            }, resolve, reject, false);
        })
    }

    delete(idFavorite){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("FavoriteDriver/Delete", "POST", {
                idFavorite
            }, resolve, reject, false);
        })
    }
}