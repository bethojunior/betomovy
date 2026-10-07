const newsletter = document.getElementById('newsletter')
const mailchimp = new MailchimpController

function register() {
    if(newsletter.value.trim() === '') {
        SimpleSwall.modalError('Prencha o campo de email corretamente')
        newsletter.focus()
        return
    }

    if(!checkEmail(newsletter.value)) {
        SimpleSwall.modalError('Email inválido')
        newsletter.focus()
        return
    }

    mailchimp
        .registerNewsletter(newsletter.value, res => {    
            if(!res.data.status) { 
                SimpleSwall.modalError(res.data.message)
                return
            }

                newsletter.value = ''
                SimpleSwall.modalSuccess(res.data.message)
    })
}

function handleEnterNewsletter(event) {

    const key = event.keyCode || event.which

    if(key === 13) {
        register()
    }
}
