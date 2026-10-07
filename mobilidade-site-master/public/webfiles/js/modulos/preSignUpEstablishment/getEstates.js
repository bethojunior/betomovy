
if(!isMobile()){
    document.getElementById("screenMobile").classList.add("screenWebSignUp");
    document.getElementById("btn-basic-info").classList.add("btnScreenWebSignp");
    document.getElementById("header-steps").style.display = "none";
    document.getElementById("headerWebSignUp").style.display = "block";
}

getEstates()

function getEstates() {
    countryController
        .getAllStates()
        .then(({status,data}) => {
            if(status)
                renderEstates(data)
        })

}

function renderEstates(arrayEstates) {

    const list = arrayEstates
                    .map(estate =>
                        `<option value='${estate.nome}' idEstate='${estate.id}'>${estate.sigla}</option>` ).join()

    elementProperty
        .getElement('#hostel-estate', element => {
            element.innerHTML = ''
            element.innerHTML += list

            getCities(element)
        })

}

function getCities(estatesElement) {
    estatesElement.onchange = element => {

        const estateId = element.srcElement

        countryController
            .getAllCityByIdState(estateId.options[estateId.selectedIndex].getAttribute('idEstate'))
                .then(({status,data}) => {
                    if(status)
                        renderCities(data)
                })
                .catch(err => console.log(err))


    }
}

function renderCities(arrayCities, city = null) {
    const list = arrayCities
        .map(city =>
            `<option value='${city.nome}' idCity='${city.id}'>${city.nome}</option>` ).join()

    elementProperty
        .getElement('#hostel-city', element => {
            element.innerHTML = ''
            element.innerHTML += list

            if(city !== null) {
                element.value = city
                establishment.cityId = element.options[element.selectedIndex].getAttribute('idCity')
            }
        })
}

