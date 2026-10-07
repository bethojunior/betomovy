class HomeController {
    listAppClientVersion(){
            return new Promise((resolve, reject) => {
                axios.get(HOST_API+'App/GetAppClientVersion')
                    .then(response => resolve(response.data))
                    .catch(error   => reject(error))
            })
        }

    listAppIOSClientVersion(){
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+'App/GetAppIOSClientVersions')
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        })
    }

        listAppDriverVersion(){
            return new Promise((resolve, reject) => {
                axios.get(HOST_API+'App/GetAppDriverVersion')
                    .then(response => resolve(response.data))
                    .catch(error   => reject(error))
            })
        }

    getDefaultAppLogo(){
        return new Promise((resolve, reject) => {
            axios.get(HOST_API+'App/GetDefaultAppLogo')
                .then(response => resolve(response.data))
                .catch(error   => reject(error))
        })
    }
}