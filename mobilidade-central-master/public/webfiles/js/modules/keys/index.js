document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    KeyRepository.getKeys(Session.get("centralSelected").id).then(response => {
        console.log(response.response)
        document.getElementById('clientId').value = response.response.clientId;
        document.getElementById('clientSecret').value = response.response.clientSecret;
    }).catch(error => {
        console.log('Error to fetch ifood keys settings : ', error);
    })

    elementProperty.addEventInElement("#save-ifood-keys", "onclick", function () {
        const params = {
            'clientId' : document.getElementById('clientId').value,
            'clientSecret' : document.getElementById('clientSecret').value,
            'centralId' : Session.get("centralSelected").id
        }
        KeyRepository.putKeys(Session.get("centralSelected").id, params).then(response => {
            alert('Chaves salvas com sucesso!');
        }).catch(error => {
            console.log('Error to put ifood keys settings' + error);
        });
    })
});