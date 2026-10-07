init();
Mask.setMoneyField('#value-obstacle');
Mask.setMoneyField("#value-obstacle-floor");

function init() {
    elementProperty.getElement('#mount-obstacles', these => {
        ItemController.priceObstacle(METHOD_REQUISITION['listar']).then(({status, response, message}) => {
            if (!status)
                return false;

            let content = '';
            content += response.map(item => {
                return `
                    <div class="row col-lg-5 data" data='${JSON.stringify(
                    item
                )}'>
                        <div class="col-lg-2">
                            <img width="60vw" src="${item.obstacle.picture}">
                        </div>
                        <div class="col-lg-6">
                            <b>${item.obstacle.description.toUpperCase()}</b>
                            <br>
                            Valor : R$${Mask.maskMoney(item.value)}<br>
                            Valor por andar : R$${Mask.maskMoney(
                    item.valuePerFloor
                )}
                        </div>
                        <div class="col-lg-4 options">
                            <div class="that">
                                <button class="btn btn-danger  delete-item"  id="${
                    item.id
                }"><i class="material-icons">close</i></button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            these.innerHTML = content;
            preload(false);

            elementProperty.addEventInElement('.delete-item', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar?', 'Essa ação é irreversivel').then(status => {
                    if (status) {
                        ItemController.priceObstacle(METHOD_REQUISITION['deletar'], '', id).then(response => {
                            if (response.status) {
                                init();
                                return swal('Sucesso ao excluir acessibilidade', '', 'success');
                            }
                        })
                    }
                })
            });

        });
    });
}

elementProperty.addEventInElement('.add-new-obstacles', 'onclick', function () {
    $('#modal-obstacles').modal('toggle');
    listObstacle();
});

function listObstacle(){
    preload(true);
    elementProperty.getElement('#mount-select-obstacles', these => {
        ItemController.request(METHOD_REQUISITION['listar']).then(({status, response, message}) => {
            if (!status) {
                return false;
            }

            let content = '';
            content += response.map(item => {
                return `
                    <option value="${item.id}">${item.description}</option>
                `;
            }).join('');

            these.innerHTML = content;
            $('#modal-new').modal('show');
            preload(false);

        });
    });
}

elementProperty.addEventInElement('.save-new-price-obstacle', 'onclick', function () {
    preload(true);
    let data = {};
    data.value = Mask.removeMaskMoney(document.getElementById('value-obstacle').value);
    data.obstacleOnFloorId = document.getElementById('mount-select-obstacles').value;
    data.cityId = Session.getValueInSessionLocal("citySelected", "cityId");

    data.valuePerFloor = Mask.removeMaskMoney(document.getElementById("value-obstacle-floor").value);

    ItemController.priceObstacle(METHOD_REQUISITION['inserir'], data).then(response => {
        $('#modal-obstacles').modal('hide');
        preload(false);
        if (!response.status) {
            return swal('Erro ao inserir valor', 'Contate o suporte', 'error');
        }
        init();
        swal('Valor inserido com sucesso', 'Verifique suas mudanças no app', 'success');
    });
});


elementProperty.addEventInElement('#save-new-obstacle', 'onclick', function () {
    preload(true);
    var form = new FormData();
    let name = document.getElementById('name-obstacle').value;
    let picture = document.getElementById('item-upload-obstacle');
    if (picture.files[0] !== undefined || picture.files[0] !== null) {
        form.append('picture', picture.files[0]);
    }
    form.append('picture', '');
    form.append('description', name);
    ItemController.request(METHOD_REQUISITION['inserir'], form).then(callback => {
        preload(false);
        if (callback.status) {
            init();
            document.getElementById('name-obstacle').value = '';
            listObstacle();
            $('#addObstacleModal').modal('hide');
            return swal(callback.message, 'Verifique suas mudanças no seu aplicativo', 'success');
        }
        swal('Erro ao inserir', 'Por favor contate o suporte', 'error');
    })
});
