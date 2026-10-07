document.addEventListener("DOMContentLoaded", function () {
    updateListCategory();
    getIcons();

    function updateListCategory() {
        preload(true);
        UserController.userTypeDrivers().then(({response}) => {
            elementProperty.getElement("#listCategory", element => {
                element.innerHTML = response.map(item => {
                    return `<tr>
                    <td scope="row"><img src="${item.picture}" height="50" width="50"/></td>
                    <td scope="row">${item.name} <br> ID:${item.idUserType}</td>
                    <td>${item.isActive == true ? "Ativado" : "Desativado"}</td>
                    <td>
                        <div class="custom-control custom-switch">
                          <input type="checkbox" class="custom-control-input change-status-user-type" id="userTypeStatus${item.idUserType}" value="${item.idUserType}" ${item.isActive == true ? "checked" : ""}>
                          <label class="custom-control-label" for="userTypeStatus${item.idUserType}"></label>
                        </div>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger delete-user-type btn-sm mr-1" userType='${JSON.stringify(item)}'>Excluir</button>
                        <button title="button" class="btn btn-primary btn-sm edit-user-type"  userType='${JSON.stringify(item)}'>Editar</button>
                    </td>
                </tr>`;
                }).join("");
                initEvent();
            });
        }).finally(() => {
            preload(false);
        })
    }

    function initEvent() {
        elementProperty.addEventInElement(".change-status-user-type", "onchange", function () {
            const id = this.getAttribute("value");

            preload(true);

            UserTypeController.changeStatus(id, this.checked ? "enable" : "disable").then(() => {
                preload(false);
                updateListCategory();
            });

        });

        elementProperty.addEventInElement(".delete-user-type", "onclick", function () {
            const item = JSON.parse(this.getAttribute("userType"));
            const idLast = item.idUserType;
            SwalCustom.dialogConfirm("Deseja excluir essa categoria?", "", status => {
                if (status)
                    removeCategory(item, idLast);
            });
        });

        elementProperty.addEventInElement(".edit-user-type", "onclick", function () {
            const item = JSON.parse(this.getAttribute("userType"));
            document.querySelector("#nameCategoryEdit").value = item.name;
            document.querySelector("#boardingTextEdit").value = item.boardingText;
            document.querySelector("#acceptedTextEdit").value = item.acceptedText;
            document.querySelector("#inProgressTextEdit").value = item.inProgressText;

            if (item.iconMapDriverId) {
                document.querySelector(`input[name='iconRadioDriverEdit'][value='${item.iconMapDriverId}']`).checked = true;
            } else {
                document.querySelectorAll(`input[name='iconRadioDriverEdit']`).forEach(element => {
                    element.checked = false;
                });
            }

            $('#editCategoryModal').modal('show');

            elementProperty.addEventInElement("#editCategoryModal", "onsubmit", function (event) {
                event.preventDefault();

                const formData = new FormData();

                formData.append("name", document.querySelector("#nameCategoryEdit").value);
                formData.append("boardingText", document.querySelector("#boardingTextEdit").value);
                formData.append("acceptedText", document.querySelector("#acceptedTextEdit").value);
                formData.append("inProgressText", document.querySelector("#inProgressTextEdit").value);

                if (document.querySelector("#fileIconEdit").files[0])
                    formData.append("picture", document.querySelector("#fileIconEdit").files[0]);
                    formData.append("iconMapDriverId", document.querySelector("input[name='iconRadioDriverEdit']:checked").value);

                preload(true);
                ConnectionServer.sendRequestWithFiles(`userType/${item.idUserType}`, "POST", formData, true).then(({message}) => {
                    $('#addCategoryModal').modal('hide');

                    SwalCustom.messageDialog("", message, "success").then(() => {
                        location.reload();
                    });
                }).finally(() => {
                    preload(false);
                });
            });
        })
    }

    function removeCategory(item, idLast) {
        preload(true);
        UserTypeController.delete(item.idUserType).then(({status}) => {
            preload(false);
            if (!status)
               return modifyTypeCategory(item, idLast);

            SwalCustom.messageDialog('', 'Tipo de motorista excluído com sucesso!', 'success');
            updateListCategory();
        });
    }

    function modifyTypeCategory(item, idLast) {
        SwalCustom.dialogConfirm('Existem usuários vinculados a este tipo de motorista', 'Deseja mover os vinculados para outro tipo de motorista?', status => {
            if (status) {
                preload(true);
                $('#modalChangeTypeDrive').modal('show');
                UserController.userTypeDrivers().then(({response}) => {
                    document.querySelector('.select-new-type').innerHTML += response.map(data => {
                        return `
                                            <option value="${data.idUserType}">${data.name}</option>
                                        `;
                    }).join('');
                    preload(false);
                });

                elementProperty.addEventInElement('.btn-save-new-type', 'onclick', function () {
                    const idNew = document.querySelector('.select-new-type').value;

                    if(idNew === ""){
                        return SwalCustom.messageDialog('', 'Selecione um tipo de motorista', 'info');
                    }
                    preload(true);

                    UserTypeController.changeTypeDrive(idLast, idNew).then(status => {
                        preload(false);
                        if (!status)
                            return SwalCustom.messageDialog('Ops.. Ocorreu um erro ao modificar para este tipo de motorista', 'Tente novamente.', 'error');

                        SwalCustom.messageDialog('', 'Modificado e excluído com sucesso!', 'success')
                            .then(() => {
                                $('#modalChangeTypeDrive').modal('hide');
                                UserTypeController.delete(item.idUserType).then(() => {
                                    updateListCategory();
                                })
                                updateListCategory();
                            });
                    });
                });
                preload(false);
            }
        });
    }

    function getIcons() {
        ConnectionServer.sendRequest(`iconMapDriver`, "GET", null, ({response}) => {
            document.querySelector("#listIcons").innerHTML = response.map((item, index) => {
                return `<div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="iconRadio${item.id}"
                              value="${item.id}" 
                              name="iconRadioDriver" 
                              ${index === 0 && "checked"}
                              class="custom-control-input" required>
                          <label class="custom-control-label" for="iconRadio${item.id}">
                            <img src="${item.link}" width="30" />
                          </label>
                        </div>`;
            }).join("");

            document.querySelector("#listIconsEdit").innerHTML = response.map((item) => {
                return `
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="iconRadio${item.id}Edit" 
                              value="${item.id}" 
                              name="iconRadioDriverEdit" 
                              class="custom-control-input" required>
                          <label class="custom-control-label" for="iconRadio${item.id}Edit">
                            <img src="${item.link}" width="30" />
                          </label>
                       </div>`;
            }).join("");

            document.querySelector("#listRemoveIcon").innerHTML = response.map((resp, index) => {
                return `
                    <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" id="iconRadioRemove${resp.id}"
                              value="${resp.id}"  
                              name="iconRadioDelete"
                              class="custom-control-input" required />
                          <label class="custom-control-label" for="iconRadioRemove${resp.id}">
                            <img src="${resp.link}" width="30" />
                          </label>
                        </div>
                    `;
            }).join("");

        }, () => {
        }, true);
    }

    function AddIcon(){

        $('#upload').change(function () {
            const file = ($(this)[0].files[0]);
            const fileReader = new FileReader()
            fileReader.onloadend = function () {
                $('#img').attr('src', fileReader.result)
            }
            fileReader.readAsDataURL(file);

        });

        elementProperty.addEventInElement('#btn-save-icon', 'onclick', function () {
            let img = document.getElementById('img');
            let width = img.clientWidth;
            let height = img.clientHeight;

            if(width !== 60 && height !== 96){
                return alert('Tamanho da imagem não permitido');
            }

            const data = {
                icon:document.querySelector("#upload").files[0]
            };

            preload(true);
            IconMapController.createIcon(data).then(() => {
                preload(false);
                SwalCustom.messageDialog("", "Ícone adicionado com sucesso!", "success").then(() => list());
            }).finally(() => {
                $('#modal-add-icon').modal('hide');
                getIcons();
            });
        })
    }

    elementProperty.addEventInElement("#addIcon", "onclick", function (){
        $('#modal-add-icon').modal('show');
        AddIcon();
    });
    elementProperty.addEventInElement("#addIconRegister", "onclick", function (){
        $('#modal-add-icon').modal('show');
        AddIcon();
    });
    elementProperty.addEventInElement('#removeIconModal','onclick', function () {
           const id = document.querySelector('input[name="iconRadioDelete"]:checked').value;
           SwalCustom.dialogConfirm("Deseja realmente remover o icone?","",status => {
                if(status) {
                    preload(true);
                    IconMapController.removeIcon(id).then(({status}) => {
                        preload(false);
                        if (!status)
                            return SwalCustom.messageDialog('', 'O ícone está vinculado a um tipo de usuário', 'error');

                        SwalCustom.messageDialog('', 'Icone removido com sucesso', 'success');
                        getIcons();
                    });
                }
           });
        });

     elementProperty.addEventInElement("#formRegistrationCategory", "onsubmit", function (event) {
        event.preventDefault();
        const isDeliveryman = document.querySelector("input[name='isDeliveryman']:checked");

        const formData = new FormData();

        formData.append("name", document.querySelector("#nameCategory").value);
        formData.append("picture", document.querySelector("#fileIcon").files[0]);
        formData.append("isActive", document.querySelector("#isActive").checked ? 1 : 0);
        formData.append("iconMapDriverId", document.querySelector("input[name='iconRadioDriver']:checked").value);
        formData.append("boardingText", document.querySelector("#boardingText").value);
        formData.append("acceptedText", document.querySelector("#acceptedText").value);
        formData.append("inProgressText", document.querySelector("#inProgressText").value);

        if (isDeliveryman) {
            formData.append("isDeliveryMan", document.querySelector("input[name='isDeliveryman']:checked").value);
        }

        preload(true);
        ConnectionServer.sendRequestWithFiles("userType", "POST", formData, true).then(({message}) => {
            $('#addCategoryModal').modal('hide');

            SwalCustom.messageDialog("", message, "success").then(() => {
                location.reload();
            });
        }).finally(() => {
            preload(false);
        });
    });

});