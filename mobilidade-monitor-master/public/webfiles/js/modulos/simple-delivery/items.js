document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    SettingsController.getPlaceholders().then(result => {
        preload(false)
        elementProperty.getElement("#listItems", element => {
            element.innerHTML = result.response.tripItemType.map(item => {
                return `<tr>
                            <td><img src="${item.picture}" width="50" height="50"/></td>
                            <td>${item.name}</td>
                            <td><a href="#" class="delete-item" value="${item.id}">Excluir</a></td>
                        </tr>`
            }).join("");

            elementProperty.addEventInElement('.delete-item', 'onclick', function () {
                let id = this.getAttribute('value');
                SwalCustom.dialogConfirm('Você deseja apagar esse item?', 'Essa ação é permanante', status => {
                    if (status) {
                        preload(true);
                        SettingsController.optionsTypeItem(id, 'DELETE').then(callback => {
                            preload(false);
                            if (callback.status)
                                return swal('Item deletado com sucesso', '', 'success').then(() => location.reload());

                            return swal('Erro au deletar esse tipo de item', 'Contate o suporte', 'error');
                        });
                    }
                });
            });
        })
    });


    elementProperty.addEventInElement("#iconItemDelivery", "onchange", function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                document.querySelector("#iconDeliveryPreview").setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    elementProperty.addEventInElement("#btnAddItemDelivery", "onclick", function () {
        const nameDelivery = document.querySelector("#nameItemDelivery").value.trim();

        if (nameDelivery.length === 0)
            return SwalCustom.messageDialog("", "Digite o nome para o item", "info").then(() => {
                document.querySelector("#nameItemDelivery").focus();
            });

        const elementIcon = document.querySelector("#iconItemDelivery");

        if (!elementIcon.files[0])
            return SwalCustom.messageDialog("", "Selecione um icone para o item", "info");


        ImageUpload.resize(elementIcon.files[0], 100, 100).then((file) => {
            preload(true);
            const formData = new FormData();
            formData.append('picture', file.data, file.name);
            formData.append('name', nameDelivery);

            SettingsController.insertTypeItem(formData).then(callback => {
                preload(false);
                if (callback.status)
                    return swal(
                        'Tipo de item inserido com sucesso',
                        'Verifique suas mudanças no seu aplicativo',
                        'success').then(() => location.reload());

                swal('Erro ao inserir', 'Por favor contate o suporte', 'error');
            })
        })
    });
});