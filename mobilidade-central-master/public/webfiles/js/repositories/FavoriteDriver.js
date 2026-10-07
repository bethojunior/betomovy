class FavoriteDriver {
    
    static listActives(idCentral, page, filter = null){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    `central/${idCentral}/driver/active?page=${page}${filter ? `&filter=${filter}` : ''}`,
                    "GET",
                    null,
                    resolve,
                    reject);
        });
    }

    static updateFavoriteDriver(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/favorite/driver`, "PUT", data, resolve, reject);
        })
    }

}