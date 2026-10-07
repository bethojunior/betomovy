document.addEventListener("DOMContentLoaded", function () {
    $('[data-toggle="tooltip"]').tooltip()

    let fileUpload = null;

    TripTypeController.getTextTripTypes().then(resolve => {
        let data = resolve.response;
        document.getElementById('input0title').value = data.title_trip_types;
        document.getElementById('description-input').value = data.description_trip_types;
    });

    CustomerController.gender().then(({response}) => {
        const list = response.map(item => {
            return `<option value="${item.id}">${item.name}</option>`
        }).join("");
        document.querySelector("#genderSelect").innerHTML = list;
        document.querySelector("#genderSelectEdit").innerHTML = list;
    });


    TripTypeController.getAllV2().then((result) => {
        elementProperty.getElement("#listTripType", element => {
            element.innerHTML = result.response.map(item => {
                return `<tr>
                            <td><img class="logo-picture" src="${item.picture}" /></td>
                            <td>${item.type} <br> ID:${item.idTripType}</td>
                            <td>${item.description}</td>
                            <td><a href="#" value='${JSON.stringify(item)}' class="edit-type-trip">Editar</a></td>
                            <td><a href="#" value="${item.idTripType}" class="delete-type">Excluir</a></td>
                        </tr>`
            }).join("");

            elementProperty.addEventInElement(".edit-type-trip", "onclick", function () {
                const typeTrip = JSON.parse(this.getAttribute("value"));

                fileUpload = null;

                document.querySelector("#nameTripTypeEdit").value = typeTrip.type;
                document.querySelector("#descriptionTripTypeEdit").value = typeTrip.description;
                document.querySelector("#iconTripTypeEditPreview").src = typeTrip.picture;
                document.querySelector("#genderSelectEdit").value = typeTrip.gender.id;
                document.querySelector("#phraseTripTypeEdit").value = typeTrip.messageNoDriversFound;

                if (document.querySelector("#deliveryOptionCheckEdit"))
                    document.querySelector("#deliveryOptionCheckEdit").checked = typeTrip.deliveryOption == true;

                if (document.querySelector("#freightOptionCheckEdit"))
                    document.querySelector("#freightOptionCheckEdit").checked = typeTrip.freightOption == true;

                if (document.querySelector("#onlyCentralOptionCheckEdit"))
                    document.querySelector("#onlyCentralOptionCheckEdit").checked = typeTrip.onlyCentral == true;

                if (document.querySelector("#targetLessCallOptionCheckEdit"))
                    document.querySelector("#targetLessCallOptionCheckEdit").checked = typeTrip.openPrice == true;

                if (document.querySelector("#inputCheckTypeServicesEdit"))
                    document.querySelector("#inputCheckTypeServicesEdit").checked = typeTrip.serviceOption == true;

                if (document.querySelector("#offerOptionCheckEdit")) {
                    document.querySelector("#offerOptionCheckEdit").checked = typeTrip.offerOption == true;

                if (document.querySelector("#totemOptionCheckEdit"))
                    document.querySelector("#totemOptionCheckEdit").checked = typeTrip.totemOption == true;

                    disableCheckbox("#deliveryOptionCheckEdit", typeTrip.offerOption == true);
                    disableCheckbox("#freightOptionCheckEdit", typeTrip.offerOption == true);
                    disableCheckbox("#onlyCentralOptionCheckEdit", typeTrip.offerOption == true);
                    disableCheckbox("#createTargetlessCallOptionCheckEdit", typeTrip.offerOption == true);
                    disableCheckbox("#inputCheckTypeServicesEdit", this.checked);
                    disableCheckbox("#totemOptionCheckEdit", typeTrip.offerOption == true);
                }

                $('#editTripTypeModal').modal('show');

                elementProperty.addEventInElement('#editNewTrip', 'onclick', function () {
                    preload(true)
                    const form = new FormData();

                    if (fileUpload)
                        form.append('picture', fileUpload.data, fileUpload.name);

                    form.append('type', document.querySelector("#nameTripTypeEdit").value);
                    form.append('description', document.querySelector("#descriptionTripTypeEdit").value);
                    form.append('gender_id', document.querySelector("#genderSelectEdit").value);
                    form.append('messageNoDriversFound', document.querySelector("#phraseTripTypeEdit").value);

                    if (document.querySelector("#deliveryOptionCheckEdit"))
                        form.append("deliveryOption", document.querySelector("#deliveryOptionCheckEdit").checked ? "1" : "0");

                    if (document.querySelector("#freightOptionCheckEdit"))
                        form.append("freightOption", document.querySelector("#freightOptionCheckEdit").checked ? "1" : "0");

                    if (document.querySelector("#onlyCentralOptionCheckEdit"))
                        form.append("onlyCentral", document.querySelector("#onlyCentralOptionCheckEdit").checked ? "1" : "0");

                    if (document.querySelector("#targetLessCallOptionCheckEdit"))
                        form.append("openPrice", document.querySelector("#targetLessCallOptionCheckEdit").checked ? "1" : "0");

                    if (document.querySelector("#offerOptionCheckEdit"))
                        form.append("offerOption", document.querySelector("#offerOptionCheckEdit").checked ? "1" : "0");

                    if (document.querySelector("#inputCheckTypeServicesEdit"))
                        form.append("serviceOption", document.querySelector("#inputCheckTypeServicesEdit").checked ? "1" : "0");

                    if (document.querySelector("#totemOptionCheckEdit"))
                        form.append("totemOption", document.querySelector("#totemOptionCheckEdit").checked ? "1" : "0");
                    
                    TripTypeController.updateTypeOfCall(form, typeTrip.idTripType).then(resolve => {
                        preload(false);
                        if (resolve.status)
                            return swal('Dados atualizados com sucesso', 'Verifique sua mudança no app', 'success').then(() => location.reload());
                        swal('Erro ao atualizar dados', 'Entrar em contato com o suporte', 'info');
                    });
                });


            });

            elementProperty.addEventInElement('.delete-type', 'onclick', function () {
                let id = this.getAttribute("value");
                SwalCustom.confirm('Deseja deletar esse tipo de chamado?', 'Caso tenha configurado tarifas para esse tipo de chamado, elas serão APAGADAS juntamente com o tipo de chamado').then(response => {
                    if (response) {
                        preload(true)
                        TripTypeController.delete(id).then(({status, response}) => {
                            preload(false)
                            if (status)
                                return swal('Deletado com sucesso', '', 'success').then(() => location.reload());
                            swal('Erro ao deletar tipo de viagem', 'Contate o suporte - ' + response, 'error')
                        }).finally(() => preload(false));
                        return false;
                    }
                });
            });
        });
    });

    function disableCheckbox(id, disable){
        if(!document.querySelector(id))
            return;
        document.querySelector(id).disabled = disable;

        if(disable)
            document.querySelector(id).checked = false;
    }

    elementProperty.addEventInElement("#offerOptionCheck","onchange",function(){
        disableCheckbox("#deliveryOptionCheck", this.checked);
        disableCheckbox("#freightOptionCheck", this.checked);
        disableCheckbox("#onlyCentralOptionCheck", this.checked);
        disableCheckbox("#createTargetlessCallOptionCheck", this.checked);
        disableCheckbox("#inputCheckTypeServices", this.checked);
    });

    elementProperty.addEventInElement("#offerOptionCheckEdit","onchange",function(){
        disableCheckbox("#deliveryOptionCheckEdit", this.checked);
        disableCheckbox("#freightOptionCheckEdit", this.checked);
        disableCheckbox("#onlyCentralOptionCheckEdit", this.checked);
        disableCheckbox("#createTargetlessCallOptionCheckEdit", this.checked);
        disableCheckbox("#inputCheckTypeServicesEdit", this.checked);
        disableCheckbox("#totemOptionCheckEdit", this.checked);
    });

    elementProperty.addEventInElement("#iconTripTypeEdit", "onchange", function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                document.querySelector("#iconTripTypeEditPreview").setAttribute('src', e.target.result);
                ImageUpload.resize(this.files[0], 250, 250).then((result) => {
                    fileUpload = result;
                })
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    elementProperty.addEventInElement("#iconTripType", "onchange", function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                document.querySelector("#iconTripTypePreview").setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    elementProperty.addEventInElement("#addNewTrip", "onclick", function () {
        const form = new FormData();
        let title = document.getElementById('nameTripType').value;
        let description = document.getElementById('descriptionTripType').value;
        let phraseTripType = document.getElementById('phraseTripType').value;

        if (title.trim() === '' || description.trim() === '' || phraseTripType === '')
            return swal('Preencha todos os campos', '', 'info');

        if (document.querySelector("#iconTripType").files[0] == null)
            return swal("Selecione um icone para imagem", '', 'info');

        ImageUpload.resize(document.querySelector("#iconTripType").files[0], 250, 250).then(result => {
            preload(true);
            form.append('picture', result.data, result.name);
            form.append('type', title);
            form.append('showType', '1');
            form.append('description', description);
            form.append('gender_id', document.querySelector("#genderSelect").value);
            form.append('messageNoDriversFound', document.querySelector("#phraseTripType").value);


            if (document.querySelector("#deliveryOptionCheck"))
                form.append("deliveryOption", document.querySelector("#deliveryOptionCheck").checked ? "1" : "0");

            if (document.querySelector("#freightOptionCheck"))
                form.append("freightOption", document.querySelector("#freightOptionCheck").checked ? "1" : "0");

            if (document.querySelector("#onlyCentralOptionCheck"))
                form.append("onlyCentral", document.querySelector("#onlyCentralOptionCheck").checked ? "1" : "0");

            if (document.querySelector("#createTargetlessCallOptionCheck"))
                form.append("openPrice", document.querySelector("#createTargetlessCallOptionCheck").checked ? "1" : "0");

            if (document.querySelector("#offerOptionCheck"))
                form.append("offerOption", document.querySelector("#offerOptionCheck").checked ? "1" : "0");

            if (document.querySelector("#inputCheckTypeServices"))
                form.append("serviceOption", document.querySelector("#inputCheckTypeServices").checked ? "1" : "0");

            if (document.querySelector("#totemOptionCheck"))
                form.append("totemOption", document.querySelector("#totemOptionCheck").checked ? "1" : "0");

            TripTypeController.create(form).then(resolve => {
                preload(false);
                if (resolve.status)
                    return swal('Novo tipo de chama adicionado com sucesso',
                        ``, 'success')
                        .then(() => {
                            location.reload();
                        });

                swal('Erro ao inserir dados', 'Entrar em contato com o suporte', 'info');
            })
        });
    });

    elementProperty.addEventInElement('#send-about-trips', 'onclick', function () {
        SwalCustom.dialogConfirm('Deseja mudar as informações sobre os tipos de viagem', 'Confirme para continuar', status => {
            if (status) {
                preload(true);
                let data = {};
                data.title_trip_types = document.getElementById('input0title').value;
                data.description_trip_types = document.getElementById('description-input').value;
                TripTypeController.insertTextTextTypes(data).then(resolve => {
                    preload(false);
                    if (resolve.status) {
                        swal('', resolve.message, 'success');
                        return;
                    }
                    swal('ops', resolve.message, 'error');
                });
                return;
            }
            Toastr.error('Cancelado')
        });
    });

});