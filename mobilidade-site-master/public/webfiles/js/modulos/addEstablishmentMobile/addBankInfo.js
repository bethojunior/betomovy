function addBankInfo() {
    elementProperty
        .addEventInElement('#btn-bank-info','onclick', () => {

            const bankId = document.getElementById('banks')
            establishment.bankAccount.bankId = parseInt(bankId.options[bankId.selectedIndex].getAttribute('value'))

            const typeAccount =  document.getElementById('bank-types')
            establishment.bankAccount.typeAccount = typeAccount.options[typeAccount.selectedIndex].getAttribute('value')

            establishment.bankAccount.agency = document.getElementById('bank-agency').value !== '' ? document.getElementById('bank-agency').value : null
            establishment.bankAccount.numberAccount = document.getElementById('bank-account').value !== '' ? document.getElementById('bank-account').value : null
            establishment.bankAccount.numberAccountDigit = document.getElementById('account-dv').value !== '' ? document.getElementById('account-dv').value : null
            establishment.bankAccount.op = document.getElementById('op').value !== '' ? document.getElementById('op').value : null
            establishment.bankAccount.holderName = document.getElementById('holder-account').value !== '' ? document.getElementById('holder-account').value : null
            establishment.bankAccount.document = document.getElementById('document-bank').value !== '' ? document.getElementById('document-bank').value : null

            validateBankInfo(establishment)

        })
}

function validateBankInfo(establishment) {

    if(establishment.bankAccount.agency === '' || establishment.bankAccount.agency === null) {
        swal('Campo agência é obrigatório','','warning')
            .then(() => document.getElementById('bank-agency').focus())
        return
    }

    if(establishment.bankAccount.numberAccount === '' || establishment.bankAccount.numberAccount === null) {
        swal('Campo de número da conta é obrigatório','','warning')
            .then(() => document.getElementById('bank-account').focus())

        return
    }

    if(establishment.bankAccount.numberAccountDigit === '' || establishment.bankAccount.numberAccountDigit === null) {
        swal('Campo dígito da conta é obrigatório','','warning')
            .then(() => document.getElementById('account-dv').focus())

        return
    }

    if(establishment.bankAccount.typeAccount === '' || establishment.bankAccount.typeAccount === null) {
        swal('Campo tipo da conta é obrigatório','','warning')
            .then(() => document.getElementById('bank-types').focus())
        return
    }

    if(establishment.bankAccount.holderName === '' || establishment.bankAccount.holderName === null) {
        swal('Campo de titular da conta é obrigatório','','warning')
            .then(() => document.getElementById('holder-account').focus())
        return
    }

    const documentType = document.getElementById('document-bank-type')

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === '' ) {
        swal('Selecione um tipo de documento','','warning')
            .then(() => document.getElementById('document-bank-type').focus())
        return
    }

    if(establishment.bankAccount.document === '' || establishment.bankAccount.document === null) {
        swal('Campo de documento é obrigatório','','warning')
            .then(() => document.getElementById('document-bank').focus())
        return
    }

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cpf') {
        if(!checkCPF(establishment.bankAccount.document)) {
            swal('CPF inválido','','warning')
                .then(() => document.getElementById('document-bank').focus())
            return
        }
    }

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cnpj') {
        if(!checkCNPJ(establishment.bankAccount.document)) {
            swal('CNPJ inválido','','warning')
                .then(() => document.getElementById('document-bank').focus())
            return
        }
    }

    renderAddImages()
}