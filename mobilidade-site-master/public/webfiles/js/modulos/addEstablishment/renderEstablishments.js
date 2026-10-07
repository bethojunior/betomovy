observeChangeEstate()

function renderEstates(listEstates) {

    let list = ''

    listEstates.map(estate => {
        list += `<option class="uf-item" value='${estate.nome}' idEstate='${estate.id}'>${estate.nome}</option>`
    })

    elementProperty.getElement('#inf-uf', element => {
        element.innerHTML = ''
        element.innerHTML += list
    })

}

function observeChangeEstate() {
    elementProperty.addEventInElement('#inf-uf', 'onchange', element => {

        establishment.estateId = element.srcElement.options[element.srcElement.selectedIndex].getAttribute('idestate')
        countryController
            .getAllCityByIdState(element.srcElement.options[element.srcElement.selectedIndex].getAttribute('idestate'))
            .then(response => renderCities(response.data))
    })
}

function renderCities(listCities,city = null) {

    let list = ''

    listCities.map(city =>
        list +=  `<option class="city-item" value='${city.nome}' idCity='${city.id}'>${city.nome}</option>`
    )

    elementProperty.getElement('#inf-cidade', element => {
        element.innerHTML = ''
        element.innerHTML += list

        if(city !== null) {
            element.value = city
            establishment.cityId = element.options[element.selectedIndex].getAttribute('idCity')
        }

    })

    observeChangeCity()
}

function observeChangeCity() {
    elementProperty
        .addEventInElement('#inf-cidade', 'onchange', element => establishment.cityId = element.srcElement.options[element.srcElement.selectedIndex].getAttribute('idCity'))
}


$('select').material_select('destroy');