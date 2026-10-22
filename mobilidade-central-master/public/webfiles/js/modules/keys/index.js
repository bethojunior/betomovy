document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    const central = Session.get("centralSelected");
    const centralId = central?.id;

    if (centralId) {
        KeyRepository.getKeys(centralId).then(response => {
            const data = response?.response || response?.data;
            if (data) {
                const clientIdEl = document.getElementById('clientId');
                const clientSecretEl = document.getElementById('clientSecret');
                if (clientIdEl && data.clientId) clientIdEl.value = data.clientId;
                if (clientSecretEl && data.clientSecret) clientSecretEl.value = data.clientSecret;
            }
        }).catch(error => {
            console.log('Error to fetch ifood keys settings: ', error);
        });
    }

    elementProperty.addEventInElement("#save-ifood-keys", "onclick", function () {
        const curCentralId = Session.get("centralSelected")?.id || centralId;
        if (!curCentralId) {
            SwalCustom ? SwalCustom.messageDialog("", "Selecione uma central para salvar as chaves", undefined, "warning") : alert("Selecione uma central");
            return;
        }

        const clientIdVal = document.getElementById('clientId')?.value || '';
        const clientSecretVal = document.getElementById('clientSecret')?.value || '';

        const params = {
            'clientId': clientIdVal,
            'clientSecret': clientSecretVal,
            'centralId': curCentralId
        };

        KeyRepository.putKeys(curCentralId, params).then(response => {
            SwalCustom ? SwalCustom.messageDialog("", "Chaves salvas com sucesso!", undefined, "success") : alert('Chaves salvas com sucesso!');
        }).catch(error => {
            console.log('Error to put ifood keys settings: ', error);
            SwalCustom ? SwalCustom.messageDialog("", "Erro ao salvar as chaves", undefined, "error") : alert('Erro ao salvar as chaves');
        });
    });
});
