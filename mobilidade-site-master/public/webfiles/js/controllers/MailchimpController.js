class MailchimpController {
    
    registerNewsletter(email,callback) {
        preload(true)
        axios.post(CURRENT_HOST+'MailChimp/IntegrateMailChimp', { email })
            .then(response => {
                callback(response)
                preload(false)
            })
            .catch(error => {
                preload(false)
                console.log(error)
            })
    }
} 