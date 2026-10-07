document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    SettingsController.getPlaceholders().then(callback => {
        preload(false);
        let data = callback.response.deliveryInfoSuggestion;

        elementProperty.getElement('#obs', obs => {
            obs.value = data.obs;
        });

        elementProperty.getElement('#origin', origin => {
            origin.value = data.obsOrigin;
        });

        elementProperty.getElement('#destiny', destiny => {
            destiny.value = data.obsDestination;
        });
    });

    elementProperty.addEventInElement('.saveNewPlaces', 'onclick', function () {
        preload(true);
        let data = {};
        data.obs = document.getElementById('obs').value;
        data.obsOrigin = document.getElementById('origin').value;
        data.obsDestination = document.getElementById('destiny').value;
        SettingsController.updatePlaceHolders(data).then(callback => {
            preload(false);
            if (callback.status) {
                return swal('Dados atualizados com sucesso', 'Confira suas mudanças no aplicativo', 'success');
            }
            swal('Erro ao atualizar', 'Contactar suporte', 'error')
        });
    });


});