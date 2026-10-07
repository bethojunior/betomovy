preload(true);
init();

var optionButton = (status = false) => {
    if(status){
        $('#modal-add-radius').modal('toggle');
        return document.getElementById('add-new').style.display = 'block';
    }
    document.getElementById('add-new').style.display = 'none';
};

elementProperty.addEventInElement('#add-new','onclick',function () {
    $('#modal-add-radius').modal('toggle');
});

function init(){
    SettingController.getRadiusByCity(METHOD_REQUISITION['listar']).then(({status,response,message}) => {

        if(!status){
            preload(false);
            return swal('Erro ao buscar do raio de chamado','Contate o suporte','info');
        }
        if(response === null){
            preload(false);
            return optionButton(true);
        }

        preload(false);


        elementProperty.getElement('.mount-radius',these => {
            these.innerHTML = `
                <div class="col-lg-12">
                    <div class="form-group">
                        <label>Primeiro Raio</label>
                        <input id="radius" class="form-control"  value="${response.radius}" type="number">
                    </div>
                    <div class="form-group">
                        <label>Segundo Raio</label>
                        <input id="greaterRadius" class="form-control"  value="${response.greaterRadius}" type="number">
                    </div>
                    <button data-id="${response.idZone}" id="update-that" class="btn btn-primary">Salvar</button>
                </div>
            `;
            elementProperty.addEventInElement('#update-that','onclick',function () {
                SwalCustom.confirm('Deseja mudar o raio de chamado?','Essa modificação irá alterá drasticamente o seu app').then(status => {
                    if(status){
                        return Radius.update(['radius','greaterRadius'],this.getAttribute('data-id'));
                    }
                });
            });
        });

    });
}

elementProperty.addEventInElement('#save-new-radius','onclick',function () {
    Radius.insert(['radius','greaterRadius']);
    $('#modal-add-radius').modal('toggle');
    init();
    optionButton(false);
});

