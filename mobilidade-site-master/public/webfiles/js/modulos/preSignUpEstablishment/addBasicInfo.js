initSearchBox();
getCoordsCepInput();

function initSearchBox() {
    localStorage.removeItem("bank");
    new MapService().importScriptWithPlaces(true).then(() => {
        elementProperty.getElement("#hostel-address", element => {
            const searchBox = new google.maps.places.SearchBox(element);
            searchBox.addListener('places_changed', function () {
                const places = searchBox.getPlaces();
                const place = places[0];

                fillFieldsBasicInfo(place)

            });

        })
    });

    elementProperty.addEventInElement("#hostel-city","onchange",function(){
        establishment.cityId = parseInt(this.options[this.selectedIndex].getAttribute('idcity'))
    });
}

function fillFieldsBasicInfo(place) {
    localStorage.setItem("place", JSON.stringify(place));

    if (place.name !== undefined) {
        elementProperty.getElement("#hostel-name", element => {
            if (element.value.length === 0)
                element.value = place.name
        });
    }

    const address = searchInPlace("route", place)+" "+searchInPlace("street_number", place)
        + " "+searchInPlace("sublocality", place);

    elementProperty.getElement("#hostel-cep", element => element.value = searchInPlace("postal_code", place));
    /*elementProperty.getElement("#hostel-address", element => element.value = searchInPlace("route", place));*/
    elementProperty.getElement("#hostel-number", element => element.value = searchInPlace("street_number", place));
    elementProperty.getElement("#hostel-neighboor", element => element.value = searchInPlace("sublocality", place));
    elementProperty.addEventInElement("#hostel-address",element=> element.value = address);
    elementProperty.getElement("#hostel-estate", element => {
        element.value = searchInPlace("administrative_area_level_1", place)

        const estateId = element;
        establishment.estateId = estateId.options[estateId.selectedIndex].getAttribute('idEstate')

        countryController
            .getAllCityByIdState(establishment.estateId)
            .then(({status, data}) => {
                if (status) {
                    renderCities(data)
                    elementProperty.getElement("#hostel-city",
                        city => {
                            city.value = searchInPlace("administrative_area_level_2", place)
                            establishment.cityId = parseInt(city.options[city.selectedIndex].getAttribute('idcity'))
                        });
                }
            })
            .catch(err => console.log(err))

    });

    establishment.latitude = place.geometry.location.lat();
    establishment.longitude = place.geometry.location.lng();


    if (place.rating !== undefined)
        establishment.rating = place.rating;

    if (place.international_phone_number !== undefined)
        establishment.commercialPhone = place.formatted_phone_number;

    //establishment.photos = getPhotos(place);
}

function getPhotos(place) {
    if (place.photos === undefined)
        return [];
    return place.photos.map(photo => {
        return photo.getUrl();
    })
}

function searchInPlace(name, place) {
    const data = place.address_components.filter(data => {
        return data.types.includes(name);
    });

    if (data.length === 0)
        return "";

    return data[0].long_name;
}

addbasicInfo()

function addbasicInfo() {

    applyMaskBasicInfo()

    elementProperty
        .addEventInElement('#btn-basic-info', 'onclick', () => {
            establishment.alias = document.getElementById('hostel-name').value !== '' ? document.getElementById('hostel-name').value : null
            //establishment.document = document.getElementById('hostel-cnpj').value !== '' ? document.getElementById('hostel-cnpj').value : null
            establishment.address = document.getElementById('hostel-address').value !== '' ? document.getElementById('hostel-address').value : null
            establishment.number = document.getElementById('hostel-number').value !== '' ? document.getElementById('hostel-number').value : null
            establishment.zipcode = document.getElementById('hostel-cep').value !== '' ? document.getElementById('hostel-cep').value : null
            establishment.neighborhood = document.getElementById('hostel-neighboor').value !== '' ? document.getElementById('hostel-neighboor').value : null

            const estateId = document.getElementById('hostel-estate')
            establishment.estateId = parseInt(estateId.options[estateId.selectedIndex].getAttribute('idestate'))

            validateEmptyValues(establishment)

        })
}

function validateEmptyValues(establishment) {

    if (establishment.alias === '' || establishment.alias === null) {
        swal('Nome do hotel é obrigatório', '', 'warning')
            .then(() => document.getElementById('hostel-name').focus())

        return
    }

    /*if (establishment.zipcode === '' || establishment.zipcode === null) {
        swal('CEP é obrigatório', '', 'warning')
            .then(() => document.getElementById('hostel-cep').focus())

        return
    }*/

    if (establishment.address === '' || establishment.address === null) {
        swal('Campo endereço é obrigatório', '', 'warning')
            .then(() => document.getElementById('hostel-address').focus())
        return
    }

    if (establishment.number === '' || establishment.number === null) {
        establishment.number = ' ';
    }

    if (establishment.neighborhood === '' || establishment.neighborhood === null) {
        swal('O campo bairro é obrigatório', '', 'warning')
            .then(() => document.getElementById('hostel-neighboor').focus())
        return
    }

    if (establishment.cityId === '' || establishment.cityId === null) {
        swal('Preencha o campo de cidade corretamente', '', 'warning')
            .then(() => document.getElementById('hostel-city').focus())
        return
    }

    /*if (establishment.document === '' || establishment.document === null) {
        swal('O CNPJ é obrigatório', '', 'warning')
            .then(() => document.getElementById('hostel-cnpj').focus())
        return
    }*/

    if (establishment.latitude === '' || establishment.latitude === null) {
        swal('Atenção', 'Endereço não encontrando', 'warning')
            .then(() => document.getElementById('hostel-cep').focus())
        return
    }

    if (establishment.longitude === '' || establishment.longitude === null) {
        swal('Atenção', 'Endereço não encontrando', 'warning')
            .then(() => document.getElementById('hostel-cep').focus())
        return
    }

    /*if (!checkCNPJ(establishment.document)) {
        swal('Informe um CNPJ válido', '', 'warning')
            .then(() => document.getElementById('hostel-cnpj').focus())
        return
    }*/

   // renderBankInfo();
    renderDataUser();

}