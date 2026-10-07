class UserController {
    getAllUserTypes() {
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+'User/GetUserTypes')
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        })
    }
}