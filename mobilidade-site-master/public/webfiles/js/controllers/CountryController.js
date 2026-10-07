class CountryController{

    getAllStates() {
        return new Promise((resolve,reject) =>{
            apis
                .stateGetAll()
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))

        })
    }

    getAllCityByIdState(id){
        return new Promise((resolve,reject) => {
            apis
                .cityGetAll(id)
                    .then(response => resolve(response.data))
                    .catch(error   => reject(error))
        })
    }
}