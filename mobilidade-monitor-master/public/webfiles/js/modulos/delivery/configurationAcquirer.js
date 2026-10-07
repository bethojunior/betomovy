getToken();

function getToken() {
    preload(true);
    DeliveryRateController.getToken().then(({response}) => {
        document.querySelector('#keyAsaas').value = response
        preload(false);
    });
}

elementProperty.addEventInElement('#saveUpdate', 'onclick', function () {
    const value = document.getElementById('keyAsaas').value;
    const data = {};
    data.value = value;
    SwalCustom.confirm('Você realmente deseja atualizar a sua chave de adquirente?','').then(status =>{
        preload(true);
        if(status)
            DeliveryRateController.updateToken(data).then(({status}) =>{
                preload(false);
                if(!status)
                    SwalCustom.messageDialog('','Não foi possivel atualizar sua chave dessa adquirente','error');

                SwalCustom.messageDialog('','Chave de adquirente atualizando com sucesso','success').then( () => {
                    preload(true);
                    getToken();
                });
            });
    });

});
