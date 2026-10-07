addbasicInfo()

function addbasicInfo() {

    applyMaskBasicInfo()

    elementProperty
        .addEventInElement('#btn-basic-info','onclick', () => {
            establishment.fantasyName  = document.getElementById('hostel-name').value !== '' ? document.getElementById('hostel-name').value : null
            establishment.document     = document.getElementById('hostel-cnpj').value !== '' ? document.getElementById('hostel-cnpj').value : null
            establishment.address      = document.getElementById('hostel-address').value !== '' ? document.getElementById('hostel-address').value : null
            establishment.number       = document.getElementById('hostel-number').value !== '' ? document.getElementById('hostel-number').value : null
            establishment.zipcode      = document.getElementById('hostel-cep').value !== '' ? document.getElementById('hostel-cep').value : null
            establishment.neighborhood = document.getElementById('hostel-neighboor').value !== '' ? document.getElementById('hostel-neighboor').value : null

            const estateId = document.getElementById('hostel-estate')
            establishment.estateId = parseInt(estateId.options[estateId.selectedIndex].getAttribute('idestate'))
            const cityId = document.getElementById('hostel-city')
            establishment.cityId = parseInt(cityId.options[cityId.selectedIndex].getAttribute('idcity'))

            validateEmptyValues(establishment)

        })
}

function validateEmptyValues(establishment) {

    if(establishment.fantasyName === '' || establishment.fantasyName === null) {
        swal('Nome do hotel é obrigatório','','warning')
            .then(() => document.getElementById('hostel-name').focus())

        return
    }

    if(establishment.zipcode === '' || establishment.zipcode === null) {
        swal('CEP é obrigatório','','warning')
            .then(() => document.getElementById('hostel-cep').focus())

        return
    }

    if(establishment.address === '' || establishment.address === null) {
        swal('Campo endereço é obrigatório','','warning')
            .then(() => document.getElementById('hostel-address').focus())
        return
    }

    if(establishment.number === '' || establishment.number === null) {
        swal('O campo número é obrigatório','','warning')
            .then(() => document.getElementById('hostel-number').focus())
        return
    }

    if(establishment.neighborhood === '' || establishment.neighborhood === null) {
        swal('O campo bairro é obrigatório','','warning')
            .then(() => document.getElementById('hostel-neighboor').focus())
        return
    }

    const fullAddress = (establishment.address +
                       ' , ' + establishment.number + ' - '
                        establishment.neighborhood)

    getAddresInfo(fullAddress)
        .then(results => {

            establishment.latitude = results[0].geometry.location.lat
            establishment.longitude = results[0].geometry.location.lng

            if(establishment.cityId === '' || establishment.cityId === null) {
                swal('Preencha o campo de cidade corretamente','','warning')
                    .then(() => document.getElementById('hostel-city').focus())
                return
            }

            if(establishment.document === '' || establishment.document === null) {
                swal('O CNPJ é obrigatório','','warning')
                    .then(() => document.getElementById('hostel-cnpj').focus())
                return
            }

            if(establishment.latitude === '' || establishment.latitude === null) {
                swal('O CEP informado é inválido','Adicione um CEP válido','warning')
                    .then(() => document.getElementById('hostel-cep').focus())
                return
            }

            if(establishment.longitude === '' || establishment.longitude === null) {
                swal('O CEP informado é inválido','Adicione um CEP válido','warning')
                    .then(() => document.getElementById('hostel-cep').focus())
                return
            }

            if(!checkCNPJ(establishment.document)) {
                swal('Informe um CNPJ válido','','warning')
                    .then(() => document.getElementById('hostel-cnpj').focus())
                return
            }

            renderGeneralInfo()

        })
        .catch(() => swal('Preencha o campo de endereço corretamente','','warning'))

}