preload(true);
init();
let idSelected = '';
Mask.setMoneyField('#value-price-help');
Mask.setMoneyField('#value-helper-man');

function init() {
    elementProperty.addEventInElement('#save-new-ajudante', 'onclick', function () {
        preload(true);
        var form = new FormData();
        let name = document.getElementById('name-helper').value;
        let picture = document.getElementById('item-upload-helper');
        if (picture.files[0] !== undefined || picture.files[0] !== null) {
            form.append('picture', picture.files[0]);
        }
        form.append('picture', '');
        form.append('name', name);
        SettingsController.accessibilityHelp(METHOD_REQUISITION['inserir'], form).then(callback => {
            preload(false);
            if (callback.status) {
                init();
                document.getElementById('name-helper').value = '';
                createListHelp();
                $('#addHelperModal').modal('hide');
                return swal(callback.message, 'Verifique suas mudanças no seu aplicativo', 'success');
            }
            swal('Erro ao inserir', 'Por favor contate o suporte', 'error');
        })
    });

    elementProperty.getElement('#mount-priceHelpers', these => {
        SettingsController.priceHelpers().then(({status, response, message}) => {
            if (!status)
                return false;

            let content = '';
            content += response.map(item => {
                return `
                    <div class="row col-lg-5 data" data='${JSON.stringify(item)}'>
                        <div class="col-lg-2">
                            <img width="60vw" src="${item.accessibility_help.picture}">
                        </div>
                        <div class="col-lg-6">
                            <b>${item.accessibility_help.name.toUpperCase()}</b>
                            <br>
                            <label>Aparece ${item.quantityIcon} vezes</label>
                            <br>
                            R$${Mask.maskMoney(item.value)}
                        </div>
                        <div class="col-lg-4 options">
                            <div class="that">
                                <button class="btn btn-danger  delete-item"  id="${item.id}"><i class="material-icons">clear_all</i></button>
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
                        SettingsController.deleteHelper(id).then(response => {
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

elementProperty.addEventInElement('#create-price', 'onclick', function () {
    createListHelp()
});

function createListHelp() {
    preload(true);

    elementProperty.getElement('#mount-general-priceHelpers', these => {
        SettingsController.accessibilityHelp(METHOD_REQUISITION['listar']).then(({status, response, message}) => {
            if (!status) {
                return false;
            }

            let content = '';
            content += response.map(item => {
                return `
                <option value="${item.id}">${item.name}</option>
            `;
            }).join('');

            these.innerHTML = content;
            $('#modal-new').modal('show');
            preload(false);

        });
    });
}

elementProperty.addEventInElement('.save-new-price-helper-man', 'onclick', function () {
    let data = {};

    data.cityId = Session.getValueInSessionLocal("citySelected", "cityId");
    valor = document.getElementById('value-helper-man').value;
    data.value = valor.replace(',', '.');
    data.quantityIcon = document.getElementById('qunatity-icon').value;
    data.accessibilityHelpId = document.getElementById('mount-general-priceHelpers').value;

    if (data.quantityIcon == '0' || data.quantityIcon == '') {
        return swal('Insira uma quantidade de icones mais que 0');
    }
    preload(true);
    SettingsController.insertPriceHelper(data).then(({status, response, message}) => {
        preload(false);
        $('#modal-new').modal('hide')
        if (status) {
            init();
            return swal('Inserido com sucesso', 'Verifique suas mundanças no app', 'success');
        }
    });

});
