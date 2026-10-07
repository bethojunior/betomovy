class UserController {
    getAllUserTypes() {
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+'User/GetUserTypes')
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        })
    }

    static userTypeDrivers(){
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+'usertype/drivers')
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        })
    }

    static get(userTypeId, fullFields = 0){
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+`requiredfield/get?userTypeId=${userTypeId}&fullFields=${fullFields}` )
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        });
    }
}