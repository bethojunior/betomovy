function addContactInfo() {
    elementProperty
        .addEventInElement('#btn-contact-info','onclick', () => {

            establishment.commercialEmail    = document.getElementById('comercial-email').value !== '' ? document.getElementById('comercial-email').value : null
            establishment.administratorEmail = document.getElementById('admin-email').value !== '' ? document.getElementById('admin-email').value : null
            establishment.commercialPhone    = document.getElementById('comercial-phone').value !== '' ? document.getElementById('comercial-phone').value : null
            establishment.administratorPhone = document.getElementById('admin-phone').value !== '' ? document.getElementById('admin-phone').value : null

            validadeContactInfo(establishment)

        })
}

function validadeContactInfo(establishment) {

    if(establishment.commercialEmail === '' || establishment.commercialEmail === null) {
        swal('O campo de email comercial é obrigatório','','warning')
            .then(() => document.getElementById('comercial-email').focus())
        return
    }

    if(establishment.commercialPhone === '' || establishment.commercialPhone === null) {
        swal('O campo de telefone comercial é obrigatório','','warning')
            .then(() => document.getElementById('comercial-phone').focus())
        return
    }

    if(establishment.administratorEmail === '' || establishment.administratorEmail === null) {
        swal('O campo de email administrativo é obrigatório','','warning')
            .then(() => document.getElementById('admin-email').focus())
        return
    }

    if(establishment.administratorPhone === '' || establishment.administratorPhone === null) {
        swal('O campo de telefone administrativo é obrigatório','','warning')
            .then(() => document.getElementById('admin-phone').focus())
        return
    }

    if(!checkEmail(establishment.commercialEmail)) {
        swal('Email comercial inválido !', '', 'warning')
            .then(() => document.getElementById('comercial-emaill').focus())
        return
    }

    if(!checkEmail(establishment.administratorEmail)) {
        swal('Email administrativo inválido !', '', 'warning')
            .then(() => document.getElementById('admin-email').focus())
        return
    }

    if(establishment.commercialEmail.toLowerCase() === establishment.administratorEmail.toLowerCase()) {
        swal('Os emails do estabelecimento devem ser diferentes','','warning')
        return
    }

    renderBankInfo()
}

