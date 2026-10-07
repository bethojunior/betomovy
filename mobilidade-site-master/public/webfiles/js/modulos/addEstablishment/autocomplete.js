
getAllEstates()


function getAllEstates() {
    countryController
        .getAllStates()
            .then(({status,data}) => {
                if(data)
                    renderEstates(data)
            })
}

getApiGoogleData()

function getApiGoogleData() {
    elementProperty
        .addEventInElement('#inf-cep','onblur', element => {
            preload(true)
            getAddresInfo(element.srcElement.value)
                .then(results => {
                    if(results.length === 0) {
                        swal('CEP inválido !','Preencha os dados do endereço manualmente', 'warning')
                        preload(false)
                        return
                    }

                    // establishment.latitude = results[0].geometry.location.lat
                    // establishment.longitude = results[0].geometry.location.lng

                    if(results[0].address_components.length < 6) {
                        swal('Não foram encontradas opções do endereço !','Preencha os dados do endereço manualmente', 'warning')
                        preload(false)
                        return
                    }
                    preload(false)
                    autoCompleteAddress(results[0].address_components)
                })
                .catch((err) => console.log(err))

        })
}

function autoCompleteAddress(address) {
    document.getElementById('inf-rua').value = address[1].long_name
    document.getElementById('inf-bairro').value = address[2].long_name

    const estate = document.getElementById('inf-uf')
    estate.value = address[4].long_name

    establishment.estateId = estate.options[estate.selectedIndex].getAttribute('idEstate')

    countryController
        .getAllCityByIdState(establishment.estateId)
            .then(response => {
                renderCities(response.data, address[3].long_name)
            })
}

