class ItemController {
    static getAll(page=1,description=""){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`Item/GetAll?page=${page}&description=${description}`,
                'GET',null,resolve,reject);
        })
    }
}