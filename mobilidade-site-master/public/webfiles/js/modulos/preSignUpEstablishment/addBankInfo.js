function addBankInfo() {
    elementProperty
        .addEventInElement('#btn-bank-info','onclick', () => {

            if(localStorage.getItem("bank") === null){
                delete establishment.user['bankAccount'];
                saveData();
                return;
            }

            const bank = JSON.parse(localStorage.getItem("bank"));

            const {idBank} = bank;
            establishment.user.bankAccount.bankId = idBank

            const typeAccount =  document.getElementById('bank-types')
            establishment.user.bankAccount.typeAccount = typeAccount.options[typeAccount.selectedIndex].getAttribute('value')

            establishment.user.bankAccount.agency = document.getElementById('bank-agency').value !== '' ? document.getElementById('bank-agency').value : null
            establishment.user.bankAccount.numberAccount = document.getElementById('bank-account').value !== '' ? document.getElementById('bank-account').value : null
            establishment.user.bankAccount.numberAccountDigit = document.getElementById('account-dv').value !== '' ? document.getElementById('account-dv').value : null
            establishment.user.bankAccount.op = document.getElementById('op').value !== '' ? document.getElementById('op').value : null
            establishment.user.bankAccount.holderName = document.getElementById('holder-account').value !== '' ? document.getElementById('holder-account').value : null
            establishment.user.bankAccount.document = document.getElementById('document-bank').value !== '' ? document.getElementById('document-bank').value : null

            validateBankInfo(establishment)
        })


}

function validateBankInfo(establishment) {

    if(establishment.user.bankAccount.agency === '' || establishment.user.bankAccount.agency === null) {
        swal('Campo agência é obrigatório','','warning')
            .then(() => document.getElementById('bank-agency').focus())
        return
    }

    if(establishment.user.bankAccount.numberAccount === '' || establishment.user.bankAccount.numberAccount === null) {
        swal('Campo de número da conta é obrigatório','','warning')
            .then(() => document.getElementById('bank-account').focus())

        return
    }

    if(establishment.user.bankAccount.numberAccountDigit === '' || establishment.user.bankAccount.numberAccountDigit === null) {
        swal('Campo dígito da conta é obrigatório','','warning')
            .then(() => document.getElementById('account-dv').focus())

        return
    }

    if(establishment.user.bankAccount.typeAccount === '' || establishment.user.bankAccount.typeAccount === null) {
        swal('Campo tipo da conta é obrigatório','','warning')
            .then(() => document.getElementById('bank-types').focus())
        return
    }

    if(establishment.user.bankAccount.holderName === '' || establishment.user.bankAccount.holderName === null) {
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

    if(establishment.user.bankAccount.document === '' || establishment.user.bankAccount.document === null) {
        swal('Campo de documento é obrigatório','','warning')
            .then(() => document.getElementById('document-bank').focus())
        return
    }

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cpf') {
        if(!checkCPF(establishment.user.bankAccount.document)) {
            swal('CPF inválido','','warning')
                .then(() => document.getElementById('document-bank').focus())
            return
        }
    }

    if(documentType.options[documentType.selectedIndex].getAttribute('value') === 'cnpj') {
        if(!checkCNPJ(establishment.user.bankAccount.document)) {
            swal('CNPJ inválido','','warning')
                .then(() => document.getElementById('document-bank').focus())
            return
        }
    }

    //renderDataUser()
    saveData();
}

function saveData(){
    preload(true);

    new EmployeeController().register(establishment).then(({message,status,data})=>{
        preload(false);

        if(!status){
            swal("Atenção",message,"warning");
            return;
        }

        SimpleSwall.modalSuccess("Salvo com sucesso").then(()=>{
            location.href = HOST_PWA;
        });
    })
}