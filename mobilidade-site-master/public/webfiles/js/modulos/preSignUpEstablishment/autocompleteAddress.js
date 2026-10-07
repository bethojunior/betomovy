//getCoordsCep()

function getCoordsCep() {
    elementProperty
        .addEventInElement('#hostel-cep', 'onblur', element => {
            getCepValue(element.srcElement.value)
                .then(results => {
                    if (results.length === 0) {
                        swal('CEP inválido !', 'Coloque um CEP válido', 'warning')
                        return
                    }

                    establishment.latitude = results[0].geometry.location.lat
                    establishment.longitude = results[0].geometry.location.lng


                    if (results[0].address_components.length < 6) {
                        swal('Não foram encontradas opções do endereço !', 'Preencha os dados do endereço manualmente', 'warning')
                        return
                    }

                    autoCompleteAddress(results[0].address_components)

                })
                .catch(error => console.log(error))
            return
        })
}

function getCoordsCepInput() {
    elementProperty
        .addEventInElement('#hostel-cep', 'oninput', element => {
            if (element.srcElement.value.length < 9)
                return;


            const address =
                document.getElementById("hostel-address").value +
                document.getElementById("hostel-number").value +
                document.getElementById("hostel-neighboor").value ;

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === 'OK') {
                    localStorage.setItem("place",JSON.stringify(results[0]))
                    establishment.latitude = results[0].geometry.location.lat()
                    establishment.longitude = results[0].geometry.location.lng()

                }
            });

        })
}


function autoCompleteAddress(address) {

    document.getElementById('hostel-address').value = address[1].long_name
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