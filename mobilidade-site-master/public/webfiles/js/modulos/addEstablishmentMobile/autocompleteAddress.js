getCoordsCep()

function getCoordsCep() {
    elementProperty
        .addEventInElement('#hostel-cep','onblur', element => {
            getAddresInfo(element.srcElement.value)
                .then(results => {
                    if(results.length === 0) {
                        swal('CEP inválido !','Coloque um CEP válido', 'warning')
                        return
                    }

                    if(results[0].address_components.length < 6) {
                        swal('Não foram encontradas opções do endereço !','Preencha os dados do endereço manualmente', 'warning')
                        return
                    }

                    autoCompleteAddress(results[0].address_components)

                })
                .catch(error => console.log(error))
            return
        })
}

function autoCompleteAddress(address) {

    document.getElementById('hostel-address').value   = address[1].long_name
    document.getElementById('hostel-neighboor').value = address[2].long_name

    const estate = document.getElementById('hostel-estate')
    estate.value = address[4].long_name

    establishment.estateId = estate.options[estate.selectedIndex].getAttribute('idEstate')

    countryController
        .getAllCityByIdState(establishment.estateId)
            .then(response => {
                renderCities(response.data, address[3].long_name)
            })
}