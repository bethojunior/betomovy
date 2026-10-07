Mask.setMaskPhone(".mask-phone");
getData();

function getData() {
    preload(true);
    MenuLinkExternalController.getActiveApp().then(({response}) => {
        document.querySelector(".btn-new-menu").hidden = response.length === 5;
        document.querySelector('.list-menu').innerHTML = response.map(data => {
            return `
                <tr>
                    <td>${data.menu_app_type.name}</td>
                    <td>${data.phoneNotification || 'Não informado'}</td>
                    <td>${data.link}</td>
                    <td>${data.description}</td>
                    <td><button item='${JSON.stringify(data)}' class="btn btn-primary btn-edit-menu material-icons">edit</button></td>
                    <td><button idMenu="${data.id}" class="btn-delete-menu btn btn-danger material-icons">delete</button></td>
                </tr>
                   `
        }).join('');
        preload(false);
        elementProperty.addEventInElement('.btn-new-menu', 'onclick', function () {
            preload(true);
            $('#modal-new-menu').modal('show');

            MenuLinkExternalController.getTypeMenuApp().then(({response}) => {
                document.querySelector('.select-new-menu').innerHTML = response.map(data => {
                    return `
                              <option value="${data.id}">${data.name}</option>
                           `
                }).join('');
               preload(false);
            })
            elementProperty.addEventInElement('.btn-create', 'onclick', function () {
                const select = document.querySelector('.select-new-menu').value;
                const phone = document.getElementById('new-phone').value;
                const link = document.getElementById('new-link').value;
                const description = document.getElementById('new-description').value;

                if(ValidateForm.validateUrl(link) === false)
                    return swal('', 'Insira um link válido para seu menu', 'info');
                if(description === '' || description === 'null')
                    return swal('', 'Insira uma descrição para seu menu', 'info');

                preload(true);
                const data = {
                    description: description,
                    link: link,
                    phoneNotification: phone,
                    menuAppTypeId: select,
                    quantity: [{}]
                }

                MenuLinkExternalController.createNewPublicity(data).then(({status, response}) => {
                    preload(false);
                    if (!status)
                        return swal('', 'Ops.. Ocorreu um erro ao criar seu menu externo, tente novamente.', 'error');

                    swal('', "Menu externo criado com sucesso!", 'success');
                    document.getElementById('new-phone').value = '';
                    document.getElementById('new-link').value = '';
                    document.getElementById('new-description').value = '';
                    $('#modal-new-menu').modal('hide');
                    getData();
                });
            });
        });

        elementProperty.addEventInElement('.btn-edit-menu', 'onclick', function () {
            $('#modal-edit-menu').modal('show');

            const item = JSON.parse(this.getAttribute("item"));
            document.getElementById('phone').value = item.phoneNotification;
            document.getElementById('link').value = item.link;
            document.getElementById('description').value = item.description;

            elementProperty.addEventInElement('.btn-save', 'onclick', function () {
                const id = item.menuAppTypeId;
                const phone = document.getElementById('phone').value;
                const link = document.getElementById('link').value;
                const description = document.getElementById('description').value;

                if(ValidateForm.validateUrl(link) === false)
                    return swal('', 'Insira um link válido para seu menu', 'info');
                if(description === '' || description === 'null')
                    return swal('', 'Insira uma descrição para seu menu', 'info');

                preload(true);
                const data = {
                    menuAppTypeId: id,
                    description: description,
                    link: link,
                    phoneNotification: phone,
                    quantity: [{}],
                }

                MenuLinkExternalController.createNewPublicity(data).then(({status, response}) => {
                    preload(false);
                    if (!status)
                        return swal('', 'Ops.. Ocorreu um erro ao editar seu menu externo, tente novamente.', 'error');

                    swal('', "Menu externo alterado com sucesso!", 'success');
                    $('#modal-edit-menu').modal('hide');
                    getData();
                });
            });
        });

        elementProperty.addEventInElement('.btn-delete-menu', 'onclick', function() {
            const id = JSON.parse(this.getAttribute("idMenu"));
                SwalCustom.confirm('Deseja confirmar a exclusão desse menu?', 'Essa ação é irreversível!').then(() => {
                    preload(true);
                    MenuLinkExternalController.delete(id).then(({status}) =>{
                    preload(false);
                    if(!status)
                        return SwalCustom.messageDialog('', 'Ops.. Ocorreu um erro ao excluir seu menu, tente novamente!', 'error')
                    SwalCustom.messageDialog('', 'Menu excluído com sucesso!', 'success').then(() => getData());
                    })
                });
        });
    });
}
