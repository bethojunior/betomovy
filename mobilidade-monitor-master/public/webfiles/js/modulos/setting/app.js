preload(true);
let idSelected = '';
let city = Session.getLocal('citySelected');
let elementProperty = new ElementProperty();
mountLisTypItems();
$('.collapse').collapse();
init();
mountTripType();

$('#myList a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
});

function init() {
    SettingsController.accessibilityHelp(METHOD_REQUISITION['listar']).then(callback => {
        if (callback.status) {
            return mountListIconesAjudantes(callback.response);
        }
    });
    mountObstacles();
}

if (document.getElementById("item-upload") !== null) {
    document.getElementById("item-upload").onchange = function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                document.getElementById("image-type-item").setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    };
}

elementProperty.addEventInElement('#send-about-trips', 'onclick', function () {
    SwalCustom.dialogConfirm('Deseja mudar as informações sobre os tipos de viagem', 'Confirme para continuar', status => {
        if (status) {
            let data = {};
            data.title_trip_types = document.getElementById('input0title').value;
            data.description_trip_types = document.getElementById('description-input').value;
            TripTypeController.insertTextTextTypes(data).then(resolve => {
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

function mountListIconesAjudantes(data) {
    elementProperty.getElement('#list-helpers', these => {
        let content = '';
        content += data.map(item => {
            return `
                <div class="row col-lg-12">
                    <div class="col-lg-8">
                        ${item.name}<br>
                        <img width="50vw" src="${item.picture}">
                    </div>
                    <div class="col-lg-4">
                        <button class="btn btn-danger delete-helper" id="${item.id}"><i class="material-icons">clear_all</i></button>
                    </div>
                </div>
                <hr>
            `;
        }).join('');
        these.innerHTML = content;
        elementProperty.addEventInElement('.delete-helper', 'onclick', function () {
            let id = this.getAttribute('id');
            SwalCustom.confirm('Deseja deletar esse item?', 'Essa ação irreversivel').then(status => {
                if (status) {
                    SettingsController.deleteAccessibilityHelp(id).then(callback => {
                        if (callback.status) {
                            init();
                            return swal('Item deletado com sucesso', '', 'success');
                        }
                    });
                }
            });
        });
    });
}

function createTripTypeLayout() {
    return `<div style="padding: 5px 10px;margin-left: 1vw;background: #e0e0e0;border-radius: 5px;" class="col-lg-3">
                    <div class="form-group">
                        <label>Adcionar novo tipo de viagem <i class="material-icons">add_circle_outline</i></label>
                        <input class="form-control" id="title-type-new" aria-describedby="emailHelp" placeholder="Nome do tipo de viagem">
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <input class="form-control" id="description-type-new" aria-describedby="emailHelp">
                    </div>
                    <div class="custom-file">
                        <input id="new-type" type="file" class="custom-file-input img-type icon-type-new">
                        <label class="custom-file-label">Escolha um ícone</label>
                    </div>
                    <br>
                    <div style="margin-top: 1vw; background: white; padding: 1vw" class="container container-preview-icon">
                        <img id="preview-icon-new-type" src="/webfiles/img/icon/default.png">
                    </div>
                    <div class="center">
                        <button type="button" onclick="insertNewType()" class="btn btn-primary send-new-type">Salvar</button>
                    </div>
                </div>`;
}

function mountTripType() {
    TripTypeController.getAll().then(({status, data, message}) => {
        if (!status) {
            SwalCustom.messageDialog("", message, "info");
            return;
        }

        elementProperty.getElement("#mount-types", element => {
            element.innerHTML = `${createTripTypeLayout()}` + data.map(data => {
                return `
                <div class="col-lg-3">
                    <div class="form-group">
                        <label for="title-type#${data.idTripType}">Nome do tipo de viagem</label>
                        <input class="form-control" id="title-type#${data.idTripType}" aria-describedby="emailHelp" value="${data.type}">
                    </div>
                    <div class="form-group">
                        <label for="description-type#${data.idTripType}">Descrição</label>
                        <input class="form-control" id="description-type#${data.idTripType}" aria-describedby="emailHelp" value="${data.description}">
                    </div>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input img-type" id="${data.idTripType}">
                        <label class="custom-file-label" for="custom-file-${data.idTripType}">Escolha um ícone</label>
                    </div>
                    <br>
                    <div class="container container-preview-icon">
                        <img id="preview-icon-${data.idTripType}" src="${data.picture}">
                    </div>
                    <div class="center">
                        <button type="button" class="btn btn-primary send-type" id="${data.idTripType}" idSelected="#${data.idTripType}">Salvar</button>
                        <button type="button" class="btn btn-danger  delete-type"  id="${data.idTripType}" idSelected="#${data.idTripType}">Apagar</button>
                    </div>
                </div>
            `
            }).join(" ");

        });

        elementProperty.addEventInElement('.img-type', 'onchange', function () {
            let id = this.getAttribute('id');
            if (this.files && this.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("preview-icon-" + id).setAttribute('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        elementProperty.addEventInElement('.send-type', 'onclick', function () {
            let id = this.getAttribute("idSelected");
            elementProperty.getElement(this.getAttribute("idSelected"), image => {
                var form = new FormData();
                let title = document.getElementById('title-type' + id).value;
                let description = document.getElementById('description-type' + id).value;
                form.append('image', image.files[0]);
                form.append('title', title);
                form.append('description', description);

                TripTypeController.update(form, this.getAttribute('id')).then(resolve => {
                    if (resolve.status) {
                        swal('Dados atualizados com sucesso', 'Verifique sua mudança no app', 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 40000);
                        return;
                    }
                    swal('Erro ao atualizar dados', 'Entrar em contato com o suporte', 'info');
                })
            });
        });

        elementProperty.addEventInElement('.delete-type', 'onclick', function () {
            let id = this.getAttribute("id");
            SwalCustom.confirm('Deseja deletar esse tipo de chamado?', 'Caso tenha configurado as tarifas, elas serão apagadas junto com o tipo de chamado').then(response => {
                if (response) {
                    TripTypeController.delete(id).then(({status, response}) => {
                        if (status) {
                            mountTripType();
                            return swal('Deletado com sucesso', '', 'success');
                        }
                        swal('Erro ao deletar tipo de viagem', 'Contate o suporte - ' + response, 'error')
                    });
                    return false;
                }
            });
        });
    });

}

function insertNewType() {
    elementProperty.getElement('.icon-type-new', image => {
        var form = new FormData();
        let title = document.getElementById('title-type-new').value;
        let description = document.getElementById('description-type-new').value;
        if (title === '' || description === '') {
            return swal('Preencha todos os campos', '', 'info');
        }
        preload(true);
        form.append('picture', image.files[0]);
        form.append('type', title);
        form.append('showType', '1');
        form.append('description', description);

        TripTypeController.create(form).then(resolve => {
            preload(false);
            if (resolve.status) {
                swal('Novo tipo de chama adicionado com sucesso',
                    `1-Novo tipo de chamado(ok) 
                     2-Atrelar o tipo de chamado(Próximo)
                     3-Cadastro de tarifas`, 'success')
                    .then(() => {
                        location.href = `/setting/calledtype/${resolve.response.idTripType}`
                    });
                mountTripType();
                return;
            }
            swal('Erro ao inserir dados', 'Entrar em contato com o suporte', 'info');
        })
    });
}

TripTypeController.getTextTripTypes().then(resolve => {
    let data = resolve.response;
    document.getElementById('input0title').value = data.title_trip_types;
    document.getElementById('description-input').value = data.description_trip_types;
});

elementProperty.addEventInElement('#send-about-trips', 'onclick', function () {
    SwalCustom.dialogConfirm('Deseja mudar as informações sobre os tipos de viagem', 'Confirme para continuar', status => {
        if (status) {
            let data = {};
            data.title_trip_types = document.getElementById('input0title').value;
            data.description_trip_types = document.getElementById('description-input').value;
            TripTypeController.insertTextTextTypes(data).then(resolve => {
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

elementProperty.addEventInElement('#remove-general-balance', 'onclick', function () {
    let data = {};
    data.driverId = '';
    SwalCustom.dialogConfirm('Deseja zerar o saldo de TODOS os motoristas?', '', status => {
        if (status) {
            preload(true);
            DriverController.resetBalance(data).then(resolve => {
                preload(false);
                if (resolve.status) {
                    return swal('', resolve.message, 'success');
                }
                swal('ops', resolve.message, 'error');
            });
            return
        }
    });
});


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
    let data = {};
    data.obs = document.getElementById('obs').value;
    data.obsOrigin = document.getElementById('origin').value;
    data.obsDestination = document.getElementById('destiny').value;
    SettingsController.updatePlaceHolders(data).then(callback => {
        if (callback.status) {
            return swal('Dados atualizados com sucesso', 'Confira suas mudanças no aplicativo', 'success');
        }
        swal('Erro ao atualizar', 'Contactar suporte', 'error')
    });
});


elementProperty.addEventInElement('#name-type-item', 'onkeyup', function () {
    _that = this;
    elementProperty.getElement('#name-type-item-2', here => {
        here.innerHTML = _that.value;
    });
});

elementProperty.addEventInElement('#save-new-type-item', 'onclick', function () {
    preload(true);
    var form = new FormData();
    let name = document.getElementById('name-type-item').value;
    let image = document.getElementById('item-upload');
    form.append('picture', image.files[0]);
    form.append('name', name);

    SettingsController.insertTypeItem(form).then(callback => {
        preload(false);
        if (callback.status) {
            mountLisTypItems();
            return swal('Tipo de item inserido com sucesso', 'Verifique suas mudanças no seu aplicativo', 'success');
        }
        swal('Erro ao inserir', 'Por favor contate o suporte', 'error');
    })
});

function mountLisTypItems() {
    elementProperty.getElement('#list-type-items', here => {
        SettingsController.getPlaceholders().then(callback => {
            let content = '';
            let data = callback.response.tripItemType;
            content += data.map(response => {
                return `
                <div class="row col-lg-12 data-type-item">
                    <div class="col-lg-6 icon">
                        <img width="100%" src="${response.picture}">
                    </div>
                    <div class="col-lg-6">
                        <span>${response.name}</span>
                        <div class="option">
                            <button id="${response.id}" class="delete btn btn-danger"><i class="material-icons">clear_all</i></button>
                        </div>
                    </div>
                    <div class="col-lg-12"><hr></div>
                </div>
            `;
            }).join('');
            here.innerHTML = content;

            elementProperty.addEventInElement('.delete', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.dialogConfirm('Você deseja apagar esse tipo de item?', 'Essa ação é permanante', callback => {
                    preload(true);
                    if (callback) {
                        SettingsController.optionsTypeItem(id, 'DELETE').then(callback => {
                            preload(false);
                            if (callback.status) {
                                mountLisTypItems();
                                return swal('Tipo deletado com sucesso', '', 'success');
                            }
                            return swal('Erro au deletar esse tipo de item', 'Contate o suporte', 'error');
                        });
                        return;
                    }
                });
            });

            elementProperty.addEventInElement('.edit', 'onclick', function () {
                idSelected = this.getAttribute('id');
                $('#modal-edit').modal('show')
            });

        });
    });
}

elementProperty.addEventInElement('#edit-type-icon', 'onclick', function () {
    preload(true);
    var form = new FormData();
    let name = document.getElementById('new-name-type-item').value;
    let image = document.getElementById('new-item-upload');
    if (image.files[0] !== undefined || image.files[0] !== null) {
        form.append('picture', image.files[0]);
    }
    form.append('picture', '');
    form.append('name', name);
    $('#modal-edit').modal('toggle');
    SettingsController.updateTypeItem(idSelected, form).then(callback => {
        preload(false);
        if (callback.status) {
            mountLisTypItems();
            return swal('Tipo de item atualizado com sucesso', 'Verifique suas mudanças no seu aplicativo', 'success');
        }
        swal('Erro ao inserir', 'Por favor contate o suporte', 'error');
    })
});


function mountObstacles() {
    elementProperty.getElement('#list-obstacles', these => {
        ItemController.request(METHOD_REQUISITION['listar'], '').then(({status, response, message}) => {
            if (!status) {
                return swal('Erro ao buscar obstaculos', 'Contate o suporte e inform esse erro :' + message, 'error');
            }
            let content = '';
            content += response.map(item => {
                return `
                    <div class="row col-lg-12">
                        <div class="col-lg-8">
                            ${item.description}<br>
                            <img width="50vw" src="${item.picture}">
                        </div>
                        <div class="col-lg-4">
                            <button id="${item.id}" class="btn btn-danger delete-obstacle"><i class="material-icons">clear_all</i></button>
                        </div>
                    </div>
                    <hr>
            `;
            }).join('');
            these.innerHTML = content;

            elementProperty.addEventInElement('.delete-obstacle', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar?', 'Essa ação é permanente').then(status => {
                    if (!status) {
                        return false;
                    }
                    preload(true);
                    ItemController.request(METHOD_REQUISITION['deletar'], '', id).then(({status, response, message}) => {
                        if (!status) {
                            return swal('Erro ao deletar, Contate o suporte', message, 'error');
                        }
                        swal('Deletado com sucesso', '', 'success');
                        preload(false);
                        init();
                    });
                })
            });

        });
    });
}
