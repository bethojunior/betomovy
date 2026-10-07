elementProperty
    .addEventInElement('#btn-salva-submit','onclick', () => {
            // basic info
            establishment.fantasyName  = document.getElementById('inf-name').value !== '' ? document.getElementById('inf-name').value : null
            establishment.document     = document.getElementById('inf-cnpj').value !== '' ? document.getElementById('inf-cnpj').value : null
            establishment.address      = document.getElementById('inf-rua').value !== '' ? document.getElementById('inf-rua').value : null
            establishment.number       = document.getElementById('inf-numero').value !== '' ? document.getElementById('inf-numero').value : null
            establishment.zipcode      = document.getElementById('inf-cep').value !== '' ? document.getElementById('inf-cep').value : null
            establishment.neighborhood = document.getElementById('inf-bairro').value !== '' ? document.getElementById('inf-bairro').value : null

            const estateId = document.getElementById('inf-uf')
            establishment.estateId = parseInt(estateId.options[estateId.selectedIndex].getAttribute('idestate'))
            const cityId = document.getElementById('inf-cidade')
            establishment.cityId = parseInt(cityId.options[cityId.selectedIndex].getAttribute('idcity'))

            //estabilishment values info
            const minValue = document.getElementById('num1').value
            establishment.minDailyRate = minValue !== '' ? parseFloat(minValue.replace(',','.')) : null

            const maxValue = document.getElementById('num2').value
            establishment.maxDailyRate = maxValue !== '' ? parseFloat(maxValue.replace(',','.')) : null

            const averageValue =  document.getElementById('resultado').value
            establishment.averageValue = averageValue !== '' ? parseFloat(averageValue.replace(',','.')) : null

            const indication = document.getElementById('hostelDiscount').value
            establishment.indicationDiscount = indication !== '' ? parseFloat(indication.replace(',','.')) : null

            //contact info
            establishment.commercialEmail    = document.getElementById('email-comercial').value !== '' ? document.getElementById('email-comercial').value : null
            establishment.administratorEmail = document.getElementById('email-adm').value !== '' ? document.getElementById('email-adm').value : null
            establishment.commercialPhone    = document.getElementById('fone-comercial').value !== '' ? document.getElementById('fone-comercial').value : null
            establishment.administratorPhone = document.getElementById('fone-adm').value !== '' ? document.getElementById('fone-adm').value : null


            //bank info
            const bankId = document.getElementById('bankName')
            establishment.bankAccount.bankId = parseInt(bankId.options[bankId.selectedIndex].getAttribute('value'))

            const typeAccount =  document.getElementById('bankType')
            establishment.bankAccount.typeAccount = typeAccount.options[typeAccount.selectedIndex].getAttribute('value')

            establishment.bankAccount.agency = document.getElementById('bankAgencia').value !== '' ? document.getElementById('bankAgencia').value : null
            establishment.bankAccount.numberAccount = document.getElementById('bankConta').value !== '' ? document.getElementById('bankConta').value : null
            establishment.bankAccount.numberAccountDigit = document.getElementById('accountDV').value !== '' ? document.getElementById('accountDV').value : null
            establishment.bankAccount.op = document.getElementById('bankOp').value !== '' ? document.getElementById('bankOp').value : null
            establishment.bankAccount.holderName = document.getElementById('bankHolderName').value !== '' ? document.getElementById('bankHolderName').value : null
            establishment.bankAccount.document = document.getElementById('bankDocument').value !== '' ? document.getElementById('bankDocument').value : null

            validateEmptyValuesEstablishment(establishment)
    })

function validateEmptyValuesEstablishment(establishment) {

    // validate basic info
    if(establishment.fantasyName === '' || establishment.fantasyName === null) {
        swal('Nome do hotel é obrigatório','','warning')
            .then(() => document.getElementById('inf-name').focus())

        return
    }

    if(establishment.zipcode === '' || establishment.zipcode === null) {
        swal('CEP é obrigatório','','warning')
            .then(() => document.getElementById('inf-cep').focus())

        return
    }

    if(establishment.address === '' || establishment.address === null) {
        swal('Campo endereço é obrigatório','','warning')
            .then(() => document.getElementById('inf-rua').focus())
        return
    }

    if(establishment.number === '' || establishment.number === null) {
        swal('O campo número é obrigatório','','warning')
            .then(() => document.getElementById('inf-numero').focus())
        return
    }

    if(establishment.neighborhood === '' || establishment.neighborhood === null) {
        swal('O campo bairro é obrigatório','','warning')
            .then(() => document.getElementById('inf-bairro').focus())
        return
    }

    if(establishment.cityId === '' || establishment.cityId === null) {
        swal('Preencha o campo de cidade corretamente','','warning')
            .then(() => document.getElementById('inf-cidade').focus())
        return
    }

    if(establishment.document === '' || establishment.document === null) {
        swal('O CNPJ é obrigatório','','warning')
            .then(() => document.getElementById('inf-cnpj').focus())
        return
    }

    const fullAddress = ( establishment.address + ' , '
                       + establishment.number + ' - '
                       + establishment.neighborhood )

    getAddresInfo(fullAddress)
        .then(results => {
            establishment.latitude = results[0].geometry.location.lat
            establishment.longitude = results[0].geometry.location.lng

            if(establishment.latitude === '' || establishment.latitude === null) {
                swal('As informações de endereço não foram encontradas nos nossos registros','Verifique as informações de Endereço, Bairro e CEP','warning')
                    .then(() => document.getElementById('inf-cep').focus())
                return
            }

            if(establishment.longitude === '' || establishment.longitude === null) {
                swal('As informações de endereço não foram encontradas nos nossos registros','Verifique as informações de Endereço, Bairro e CEP','warning')
                    .then(() => document.getElementById('inf-cep').focus())
                return
            }

            //geral info
            if(establishment.rating === '' || establishment.rating === null) {
                swal('Informe a quantidade de estrelas do hotel','','warning')
                    .then(() => document.getElementById('information-basic-start').focus())
                return
            }

            if(establishment.minDailyRate === '' || establishment.minDailyRate === null) {
                swal('Informe o valor mínimo da diária','','warning')
                    .then(() => document.getElementById('num1').focus())
                return
            }

            if(establishment.maxDailyRate === '' || establishment.maxDailyRate === null) {
                swal('Informe o valor máximo da diária','','warning')
                    .then(() => document.getElementById('num2').focus())
                return
            }

            if(establishment.indicationDiscount === '' || establishment.indicationDiscount === null) {
                swal('Informe o valor do desconto','','warning')
                    .then(() => document.getElementById('hostelDiscount').focus())
                return
            }

            //contact info
            if(establishment.commercialEmail === '' || establishment.commercialEmail === null) {
                swal('O campo de email comercial é obrigatório','','warning')
                    .then(() => document.getElementById('email-comercial').focus())
                return
            }

            if(establishment.administratorEmail === '' || establishment.administratorEmail === null) {
                swal('O campo de email administrativo é obrigatório','','warning')
                    .then(() => document.getElementById('email-adm').focus())
                return
            }

            if(establishment.commercialPhone === '' || establishment.commercialPhone === null) {
                swal('O campo de telefone comercial é obrigatório','','warning')
                    .then(() => document.getElementById('fone-comercial').focus())
                return
            }

            if(establishment.administratorPhone === '' || establishment.administratorPhone === null) {
                swal('O campo de telefone administrativo é obrigatório','','warning')
                    .then(() => document.getElementById('fone-adm').focus())
                return
            }

            //bank info
            if(establishment.bankAccount.agency === '' || establishment.bankAccount.agency === null) {
                swal('Campo agência é obrigatório','','warning')
                    .then(() => document.getElementById('bankAgencia').focus())
                return
            }

            if(establishment.bankAccount.numberAccount === '' || establishment.bankAccount.numberAccount === null) {
                swal('Campo de número da conta é obrigatório','','warning')
                    .then(() => document.getElementById('bankConta').focus())

                return
            }

            if(establishment.bankAccount.numberAccountDigit === '' || establishment.bankAccount.numberAccountDigit === null) {
                swal('Campo dígito da conta é obrigatório','','warning')
                    .then(() => document.getElementById('accountDV').focus())

                return
            }

            if(establishment.bankAccount.holderName === '' || establishment.bankAccount.holderName === null) {
                swal('Campo de titular da conta é obrigatório','','warning')
                    .then(() => document.getElementById('bankHolderName').focus())
                return
            }

            const documentType = document.getElementById('documentType')

            if(documentType.options[documentType.selectedIndex].getAttribute('value') === '' ) {
                swal('Selecione um tipo de documento','','warning')
                    .then(() => document.getElementById('documentType').focus())
                return
            }

            if(establishment.bankAccount.document === '' || establishment.bankAccount.document === null) {
                swal('Campo de documento é obrigatório','','warning')
                    .then(() => document.getElementById('bankDocument').focus())
                return
            }

            //imagens
            if(images.length === 0) {
                swal('Adicione pelo menos uma foto','','warning')
                return
            }

            if(establishment.employees.length === 0) {
                swal('Adicione pelo menos um colaborador','','warning')
                return
            }

            validateInfoContent(establishment)

        })
        .catch(error => console.log(error))

}

function validateInfoContent(establishment) {

    if(!checkCNPJ(establishment.document)) {
        swal('CNPJ inválido !', '', 'warning')
        return
    }

    if(!checkEmail(establishment.commercialEmail)) {
        swal('Email comercial inválido !', '', 'warning')
        return
    }

    if(!checkEmail(establishment.administratorEmail)) {
        swal('Email administrativo inválido !', '', 'warning')
        return
    }

    const documentType = document.getElementById('documentType')

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cpf') {
        if(!checkCPF(establishment.bankAccount.document)) {
            swal('CPF do titular da conta bancária inválido !', '', 'warning')
            return
        }
    }

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cnpj') {
        if(!checkCNPJ(establishment.bankAccount.document)) {
            swal('CNPJ do titular da conta bancária inválido !', '', 'warning')
            return
        }
    }

    establishment.employees.map(employee => {
        if(!checkEmail(employee.email)) {
            swal('Email do colaborador '+employee.name+' está inválido','','warning')
            return
        }
    })

    if(establishment.commercialEmail.toLowerCase() === establishment.administratorEmail.toLowerCase()) {
        swal('Os emails do estabelecimento devem ser diferentes','','warning')
        return
    }

   insertEstablishment(establishment,images)

}

function insertEstablishment(establishment,images) {

    console.log(establishment)

    preload(true)

    EstablishmentController
        .insertEstablishment({ establishment },images, ({ status, message }) => {
        if(status) {
            swal('Estabelecimento cadastrado com sucesso','','success')
            clearForm(establishment,images)
            preload(false)
            return
        }

        swal('Erro ao cadastrar o estabelecimento',message,'warning')
        preload(false)
        return
    })
    preload(false)

}


function clearForm(establishment, images) {

    document.getElementById('inf-name').value = ''
    document.getElementById('inf-cnpj').value = ''
    document.getElementById('inf-rua').value = ''
    document.getElementById('inf-numero').value = ''
    document.getElementById('inf-cep').value = ''
    document.getElementById('inf-bairro').value = ''
    document.getElementById('inf-uf').selectedIndex = 0
    document.getElementById('inf-cidade').selectedIndex = 0
    document.getElementById('num1').value = ''
    document.getElementById('num2').value = ''
    document.getElementById('resultado').value = ''
    document.getElementById('hostelDiscount').value = ''
    document.getElementById('email-comercial').value = ''
    document.getElementById('email-adm').value = ''
    document.getElementById('fone-comercial').value = ''
    document.getElementById('fone-adm').value = ''
    document.getElementById('bankName').selectedIndex = 0
    document.getElementById('bankType').selectedIndex = 0
    document.getElementById('bankAgencia').value = ''
    document.getElementById('bankConta').value = ''
    document.getElementById('accountDV').value = ''
    document.getElementById('bankOp').value = ''
    document.getElementById('bankHolderName').value = ''
    document.getElementById('bankDocument').value = ''
    document.getElementById('list-manager').innerHTML = ''
    document.getElementById('image-1-hostel').src = CURRENT_HOST + 'webfiles/img/picture.png'
    document.getElementById('image-2-hostel').src = CURRENT_HOST + 'webfiles/img/ICON_MAIS.png'
    document.getElementById('image-3-hostel').src = CURRENT_HOST + 'webfiles/img/ICON_MAIS.png'
    document.getElementById('image-4-hostel').src = CURRENT_HOST + 'webfiles/img/ICON_MAIS.png'
    document.getElementById('image-5-hostel').src = CURRENT_HOST + 'webfiles/img/ICON_MAIS.png'

    establishment.employees.length = 0
    images.length = 0

    establishment.fantasyName               = null
    establishment.document                  = null
    establishment.address                   = null
    establishment.number                    = null
    establishment.zipcode                   = null
    establishment.neighborhood              = null
    establishment.cityId                    = null
    establishment.estateId                  = null
    establishment.rating                    = null
    establishment.minDailyRate              = null
    establishment.maxDailyRate              = null
    establishment.averageValue              = null
    establishment.commercialEmail           = null
    establishment.administratorEmail        = null
    establishment.commercialPhone           = null
    establishment.administratorPhone        = null
    establishment.indicationDiscount        = null
    establishment.latitude                  = null
    establishment.longitude                 = null
    establishment.bankAccount.bankId        = null
    establishment.bankAccount.typeAccount   = null
    establishment.bankAccount.agency        = null
    establishment.bankAccount.numberAccount = null

    clearStars()
}