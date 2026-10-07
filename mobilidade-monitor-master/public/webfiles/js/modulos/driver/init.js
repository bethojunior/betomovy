const elementProperty = new ElementProperty();
let pathImage = environment.hosts.hostImageDriver;
let pathImageDefault = environment.hosts.hostImageDefault;
let pathInital = environment.hosts.local;
let thisPage = 1;
let lastPage = 0;
let idDriver = 0;
let timeoutSearch = null;
let page = 1;
let message = null;
let cityId = Session.getLocal('citySelected').cityId;
let keyDataClient = Session.get('hide_information_client_and_driver')

let filterCity = parseInt(Session.getValueInSessionLocal("citySelected","cityId"))
Mask.setMoneyField('#valueBalance', "9", true);

DriverController.messageWhatsapp().then(({response}) => {
    message = response;
});


elementProperty.addEventInElement("#do-filter", "onkeyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-costumer").click();
    }
});

preload(true);
DriverController.getDriverRegisterStatus().then(({response}) => {
    document.querySelector("#statusControlSelected").innerHTML += response.map(item => {
        return `<option value="${item.id}">${item.text}</option>`
    }).join("");

    document.querySelector("#statusControlSelectedMobile").innerHTML += response.map(item => {
        return `<option value="${item.id}">${item.text}</option>`
    }).join("");
    preload(false);

    document.querySelector('#statusControlSelected').value = 2;
    document.querySelector('#statusControlSelectedMobile').value = 2;
    mountList('', '', '', '', '', '', '', false);
});

DriverController.getTypeUsersV2().then(({response}) => {
    document.querySelector("#driverTypeControlSelected").innerHTML += response.map(item => {
        return `<option value="${item.idUserType}">${item.name}</option>`
    }).join("");
});

elementProperty.addEventInElement("#driverTypeControlSelected", "onchange", function () {
    preload(true);
    mountList();
});

elementProperty.addEventInElement('.search-costumer', 'onclick', function () {
    if (document.querySelector('input[name="filter-costumers"]:checked') == null)
        return swal('Nenhum filtro selecionado', 'Identifique qual tipo de filtro quer aplicar', 'info');
    preload(true);
    mountList();
});

elementProperty.addEventInElement('#search-costumer-mobile', 'onclick', function () {
    if (document.querySelector('input[name="filter-costumers"]:checked') == null)
        return swal('Nenhum filtro selecionado', 'Identifique qual tipo de filtro quer aplicar', 'info');
    preload(true);
    mountList();
});

elementProperty.addEventInElement("#statusControlSelected", "onchange", function () {
    preload(true);
    mountList();
});

elementProperty.addEventInElement("#statusControlSelectedMobile", "onchange", function () {
    $('#collapseOne').collapse('hide');
    preload(true);
    mountList();
});

elementProperty.addEventInElement('.clear-filter', 'onclick', function () {
    if (document.getElementById('do-filter').value != "") {
        document.getElementById('do-filter').value = "";
    }
    mountList();
});

elementProperty.addEventInElement('#clear-filter-mobile', 'onclick', function () {
    if (document.getElementById('do-filter-mobile').value != "") {
        document.getElementById('do-filter-mobile').value = "";
    }
    $('#collapseOne').collapse('hide');
    mountList();
});

    function detectar_mobile() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

function mountList(page = 1, concat = false,  military = false, status = false) {
    preload(true);
    const valueStatusWeb = document.querySelector("#statusControlSelected").value;
    const valueStatusMobile = document.querySelector("#statusControlSelectedMobile").value;

    const driverRegisterStatusId = detectar_mobile() ? valueStatusMobile : valueStatusWeb;
    const filter = {driverRegisterStatusId};
    filter.driverType = document.querySelector("#driverTypeControlSelected").value;

    filter[document.querySelector("input[name='filter-costumers']:checked").value] = detectar_mobile()
        ? document.querySelector("#do-filter-mobile").value
        : document.querySelector("#do-filter").value;

    if(military) {
        filter['militaryForceId'] = military.militaryForceId
        filter['militaryGraduationId'] = military.militaryGraduationId
    }

    elementProperty.getElement('#mountListDriver', element => {
        let maximumAmountNegativeBalanceDriverByCity = null;
        let maximumAmountNegativeBalanceDriverGeneral = null;

        // verifica se existe valor do limite de saldo negativo por cidade
        SettingController.ConfigByCity(METHOD_REQUISITION['listar']).then(({status, response, message}) => {
            let data = response.find((item) => item?.attribute === "maximumAmountNegativeBalanceDriver");
            maximumAmountNegativeBalanceDriverByCity = data?.value;
        })

        // verifica se existe valor do limite de saldo negativo geral
        additionalAppSettingsController.getSettings().then(({response}) => {
            let data = response.find((item) => item?.key === "max_amount_for_receipt_in_vehicle");
            maximumAmountNegativeBalanceDriverGeneral = data?.value;
        })

        DriverController.getDriversList(page, filter).then(resolve => {

            let negativeBalanceDiver = null;
            if (maximumAmountNegativeBalanceDriverByCity > 0) {
                negativeBalanceDiver = maximumAmountNegativeBalanceDriverByCity;
            } else{
                negativeBalanceDiver = maximumAmountNegativeBalanceDriverGeneral;
            }
            let data = resolve.response.data;
            lastPage = resolve.response.last_page;

            let list = concat ? element.innerHTML : "";

            list += data.map(res => {
                return `
                    <div idDriver="${res.idDriver}" id="${res.idUser}" class="row col-lg-12 col-sm-12 dataCostumer">
                     
                        <div class="modal" id="modal${res.idDriver}">
                            <div id="mountPendencies${res.idDriver}"></div>
                        </div>
                        
                        <div class="col-lg-2">
                         <div style="text-align: center" class="col l12 s12"><b>${Mask.createCodeFavorite(res.nickname, res.idDriver)}</b></div>
                            <img style="border: solid 1px" class="col-12" src="${environment.hosts.hostImageDriver + res.profileImage}" onerror="this.src = environment.hosts.hostImageDefault">
                            <div class="col l12 s12 type-user"> 
                                 <span>${res.userType}</span>
                            </div>
                        </div>

                        <div class="col-lg-3">
                             <div class="form-group">
                                <span>Nome</span>
                                <input class="form-control" value="${res.name}" disabled>
                            </div>
                            <div class="form-group">
                                <span>E-mail</span>
                                <input class="form-control" value="${keyDataClient == 0 ? res.email : ""}" disabled>
                            </div> 
                            <div class="form-group">
                            ${keyDataClient == 0 ? `<a target="_blank" href='https://api.whatsapp.com/send?phone=55${res.phone}&text=${message}'>
                            <img src="/webfiles/img/icon/whatsapp.png"> </a>`: ""}
                                <span>Fone</span>
                                <input class="form-control" value="${keyDataClient == 0 ? res.phone || 'Não informado' : ""}" disabled>
                            </div>
                             <div class="form-group">
                                <span>CPF/CNPJ</span>
                                <input class="form-control" value="${keyDataClient == 0 ? res.document : ""}" disabled>
                             </div>
                             <div class="form-group">
                                <span>Versão</span>
                                <input class="form-control" value="${res.appVersion || "Não identificado"}" disabled>
                             </div>
                              ${PermissionUser.hasPermission(MOTORISTA, "editar") ? `<div class="mt-3">
                                <a href="#" class="btn-filter-payment-form" idDriver="${res.idDriver}">Formas de pagamento</a>
                            </div>` : ''}
                        </div>
                        
                        <div class="col-lg-3">
                            <div class="form-group">
                                <span>Status </span>
                                <input disabled class="form-control ${showValueBasic(checkStatus(res.registerStatus) ? 'true' : 'false', "")}"
                                value = '${showValueBasic(res.registerStatus, "AGUARDANDO")}'>
                            </div>
                            <div class="form-group">
                                <span>Pontuação </span>
                                <input class="form-control" value="${res.rating}" disabled>
                            </div>
                            <div class="form-group">
                                <span class="value-negative-balance">Valor disponivel/Limite saldo negativo: R$
                                    ${Mask.maskMoney(parseFloat(negativeBalanceDiver))}
                                </span>
                                <input class="form-control" value="R$ ${showValueBasic(Mask.maskMoney(parseFloat(res.balance)), "0,00")}" disabled>
                            </div>
                            <div class="form-group">
                                <span>Valor bloqueado </span>
                                <input class="form-control" value="R$ ${showValueBasic(Mask.maskMoney(parseFloat(res.blockedBalance)), "0,00")}" disabled>
                            </div>  
                            <div class="form-group">
                                <span>Cidade</span>
                                <input class="form-control" value="${res.city}" disabled>
                            </div>         
                        </div>

                        <div class="col-lg-3">
                            <div class="form-group">
                                <span>Criado em</span>
                                <input class="form-control" value="${Mask.setDateCrazy(res.created_at)}" disabled>
                            </div>
                            <div class="form-group">
                                <span>Carro</span>
                                <input class="form-control" value="${res.carModel || 'Não informado'}" disabled>
                            </div>
                            <div class="form-group">
                                <span>Marca</span>
                                <input class="form-control" value="${res.carBrand || 'Não informado'}" disabled>
                            </div>
                            <div class="form-group">
                                <span>Placa</span>
                                <input class="form-control" value="${res.carPlate || 'Não informado'}" disabled>
                            </div>
                            ${verifyPrePaid(res)}
                        </div>
                         <div class="col-lg-1 col-sm-12 margin-buttons" idDriver="${res.idDriver}" id="${res.idUser}" nameDriver="${res.name}">
                            <div class="row">
                                ${getPermissionOptionDriver(res)}                      
                            </div>
                        </div>
                        
                        <div class="moreThisClient" id="moreThis${res.idUser}">
                        </div>
                    </div>
                `;
            }).join("");

            if (resolve.response.next_page_url)
                list += `<a href="#" class="show-more-drivers">Mostra mais</a>`;

            element.innerHTML = list;
            preload(false);
            initEventFilterDriverFormOfPayment();

            elementProperty.addEventInElement(".change-prepaid", "onchange", function () {
                preload(true);
                DriverController.updateDriver({
                    prepaid: this.checked
                }, this.getAttribute("idDriver")).finally(() => {
                    preload(false)
                });
            });

            elementProperty.addEventInElement('.delete-driver', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar esse motorista?', 'Essa ação é irreversivel e excluirá todos os dados como viagens, saldo etc.').then(status => {
                    if (!status)
                        return false;

                    preload(true);
                    DriverController.delete(id).then(({status, message}) => {
                        preload(false);
                        if (!status)
                            return swal('Erro ao excluir motorista - ' + message, 'Contate o suporte', 'error');

                        swal('Usuário excluido com sucesso', '', 'success');
                        return mountList();
                    });
                });
            });

            elementProperty.addEventInElement('.fivePart', 'onclick', function () {
                let id = this.getAttribute('id');

                Session.set("nameDriver", this.getAttribute("nameDriver"))
                elementProperty.getElement('#modal' + id, modal => {
                    if (!modal.classList.contains('show')) {
                        modal.classList.add('show');
                        return;
                    }
                    modal.classList.remove('show');
                });
            });

            elementProperty.addEventInElement(".show-more-drivers", "onclick", function (event) {
                event.preventDefault();
                this.remove();
                thisPage = thisPage + 1;
                mountList(thisPage, true);
            });

            elementProperty.addEventInElement('.generatePass', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.dialogConfirm('Deseja gerar a senha padrao?', 'Usuário poderá acessar com a senha ' + TEMPLATE_PASSWORD, status => {
                    if (status) {
                        let data = {};
                        data.password = TEMPLATE_PASSWORD;
                        DriverController.updateDriver(data, id).then(resolve => {
                            if (resolve.status) {
                                return swal('', resolve.message, 'success');
                            }
                            swal('ops..', resolve.message, 'error');
                        });
                        return false;
                    }
                });
            });

            elementProperty.addEventInElement('.open-financial', 'onclick', function () {
                let id = this.getAttribute('id');
                window.location.href = '/driver/' + id + '/financial';
            });

            elementProperty.addEventInElement('.add-and-remove-balance', 'onclick', function () {
                let id = this.getAttribute('id');
                idDriver = id;
                $('#modalBalance').modal('show');
            });

            elementProperty.addEventInElement('.reset-balance', 'onclick', function () {
                let name = this.getAttribute('name');
                const id = data.driverId = this.getAttribute('id');
                SwalCustom.dialogConfirm('Você realmente deseja zerar o saldo do ' + name + '?', 'Esta ação é irreversível', status => {
                    if (status) {
                        DriverController.resetBalance(id).then(({status}) => {
                            if (!status) {
                                return SwalCustom.messageDialog('Tente novamente ou entre em contato com o suporte', `Ops.. Ocorreu um erro ao zerar o saldo deste motorista.`, 'error');
                            }
                            SwalCustom.messageDialog('', 'Saldo zerado com sucesso!', 'success').then(() => {
                                preload(true);
                                mountList(1);
                            });
                        });
                    }
                });
            });

            elementProperty.addEventInElement('.editDriver', 'onclick', function () {
                let id = this.getAttribute('id');
                window.location.href = pathInital + 'Driver/edit/' + id;
            });

            elementProperty.addEventInElement('.closeModalContent', 'onclick', function () {
                let id = this.getAttribute('id');
                closeModalById(id);
            });

            function closeModalById(id) {
                elementProperty.getElement('#modal' + id, modal => {
                    modal.classList.remove('show');
                });
            }

            elementProperty.addEventInElement('.blockDriver', 'onclick', function () {
                let status = this.getAttribute('value');
                let id = this.getAttribute("id");
                if (status === "Desbloquear") {
                    preload(true);
                    SettingController.getExternalServicesByCity(cityId).then((result) => {
                        if (result.response[2].external_services[0].active) {
                                preload(false);
                                document.querySelector('#idDriverBirthday').value = id;
                                return $('#modalBirthdayDriver').modal('show');
                        } else {
                            preload(false);
                            SwalCustom.dialogConfirm('Atenção', 'Deseja prosseguir com a ação de desbloqueio do motorista?', status => {
                                if (status) {
                                    preload(true);
                                    DriverController.activateRegister(this.getAttribute('id')).then(resolve => {
                                        preload(false);
                                        if (resolve.status) {
                                            swal('', resolve.message, 'success');
                                            mountList();
                                            return;
                                        }
                                        swal('ops', resolve.message, 'error');
                                    });
                                    return '';
                                }
                            });
                        }
                    });
                }

                if(status === 'Bloquear') {
                    let modal = new Modal('#modal' + id)
                    modal.open();
                    DriverController.getReasonsBlocked().then(resolve => {
                        let data = {};
                        data.blockReasonsTypeIds = [];
                        let pendencie = JSON.stringify(resolve.response[1]['idBlockReasonsType']);
                        data.blockReasonsTypeIds.push(pendencie);
                        elementProperty.getElement('#mountPendencies' + id, element => {
                            SwalCustom.dialogConfirm('Deseja bloquear o motorista?', 'Essa ação é definitiva', check => {
                                if (check) {
                                    DriverController.blockDriver(id, data).then(res => {
                                        if (res.status) {
                                            swal('', "Motorista bloqueado", 'success');
                                            mountList();
                                        }
                                    });
                                    return false;
                                }
                            })

                        });
                    })
                }

            });

            elementProperty.addEventInElement('.btn-save', 'onclick', function() {
                preload(true);
                let id = document.querySelector('#idDriverBirthday').value;
                let dateOfBirth = document.querySelector('#datOfBirthdayDriverInput').value;
                const data = {
                    dateOfBirth
                }
                DriverController.criminalRecord(id, data).then((result) => {
                preload(false);
                if(!result.status){
                    preload(false);
                    return SwalCustom.messageDialog('Existem dados inconsistentes no cadastro do motorista', `${result.response[0]}`, 'info');
                }

                $('#resultCriminalRecord').modal('show');
                document.querySelector('.modal-result').innerHTML = `
                <div class="text-justify">${result.response[0].mensagem}</div>
                <a href='${result.response[0].site_receipt}' target="_blank" class="mt-2 material-icons" style="color: black; font-size: 35px">picture_as_pdf</a>
                `;

                elementProperty.addEventInElement('.btn-unlock', 'onclick', function () {
                    preload(true);
                    document.querySelector('#datOfBirthdayDriverInput').value = '';
                    DriverController.activateRegister(id).then(resolve => {
                        preload(false);
                        if (resolve.status) {
                            swal('', resolve.message, 'success');
                            mountList();
                        }
                    });
                });
                });
            })

            elementProperty.addEventInElement('.saveDriver', 'onclick', function () {
                let data = {};
                let id = this.getAttribute('id');

                elementProperty.getElement('.name' + id, name => {
                    data.name = name.value;
                });

                elementProperty.getElement('.nickName' + id, nickname => {
                    data.nickname = nickname.value;
                });

                elementProperty.getElement('.email' + id, email => {
                    data.email = email.value;
                });

                elementProperty.getElement('.phone' + id, phone => {
                    data.phone = phone.value;
                });

                DriverController.updateDriver(data, id).then(res => {
                    closeModalById(id);
                    mountList();
                    if (res.status) {
                        swal('', res.message, 'success');
                        return;
                    }
                    swal('ops', res.message, 'error');
                });

            });

            elementProperty.addEventInElement('.btn-observation', 'onclick', function () {
                preload(true);
                $('#modalObservation').modal('show');
                DriverController.getObservation(this.id).then(({response}) => {
                    document.querySelector('.observation-edit').setAttribute("id", response.idUser);
                    document.querySelector('.observation-input').value = response.observation || "";
                    preload(false);
                })
            });

            elementProperty.addEventInElement('.observation-edit', 'onclick', function () {
                const observationInputValue = document.querySelector('.observation-input').value;
                const data = {};
                data.observation = observationInputValue;
                DriverController.createObservation(this.id, data).then(() => {
                    status = true ? SwalCustom.messageDialog(" ", "Salvo com sucesso!", "success") :
                        SwalCustom.messageDialog(" ", "Ops, ocorreu um erro ao salvar sua observação", "error");
                });
            });

            elementProperty.addEventInElement('.btn-config-driver', 'onclick', function () {
                preload(true);
                $('#modal-config-driver').modal('show');
                const id = this.id;
                DriverController.getInformation(id, page).then(({response}) => {
                    if (response.data.length > 0) {
                        if (response.next_page_url == null)
                            document.querySelector('#btn-page').style.display = 'none';

                        document.querySelector('.information-driver').innerHTML = response.data.map(resp => {
                            return `
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between">
                                    Criado em 
                                    <span class="badge" id="location-second-plan">${new Date(resp.created_at).toLocaleDateString()}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Localização em segundo plano ativada
                                    <span class="badge" id="location-second-plan">${resp.permissionLocationBackground === 1 ? 'Ativado' : 'Desativado'}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Acesso a fotos, mídias e arquivos no seu dispositivo
                                    <span class="badge" id="access-media">${resp.permissionWriteExternalStorage === 1 ? 'Ativado' : 'Desativado'}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Status do GPS
                                    <span class="badge" id="status-gps">${resp.permissionGps === 1 ? 'Ativado' : 'Desativado'}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Permissão de sobrepor tela
                                    <span class="badge" id="permission-overlap-screen">${resp.permissionSystemOverlay === 1 ? 'Ativado' : 'Desativado'}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Otimização de bateria
                                    <span class="badge" id="optimization-battery">${resp.permissionIgnoreBatteryOptimization === 1 ? 'Ativado' : 'Desativado'}</span>
                                </li>
                            </ul>
                            <br>                               
                        `;
                        }).join('');
                        preload(false);
                    } else {
                        document.querySelector('#btn-page').style.display = 'none';
                        document.querySelector('.information-driver').innerHTML = `<p>Não foi posssivel encontrar informações desse motorista</p>`;
                        preload(false);
                    }

                });
            });
            elementProperty.addEventInElement('.btn-note-driver', 'onclick', function () {
                preload(true);
                $('#modalNoteDriver').modal('show');
                DriverController.getNoteDriver(this.id).then(({response}) => {
                    const {data} = response;
                    if (data.length === 0) {
                        preload(false);
                        document.querySelector('.list-notes').innerHTML = `<p>Não há corridas registradas para esse motorista.</p>`;
                        return;
                    }

                    document.querySelector('.list-notes').innerHTML = response.data.map(item => {
                        return `
                            <li class="list-group-item">
                                <a class="btn-block text-left btn-details-of-trip"  target="_blank" href='../trip/${item.tripReference}/details' type="button" style="text-decoration: none">
                                    <div class="title-note-container font-weight-bold">
                                        ${item.userName}
                                        <div class="d-flex">${getStars(item.rating)}</div>
                                    </div>
                                    ${item.comment ? `<div class="mt-2">
                                                        <label class="container-comment text-justify">${item.comment}</label>
                                                     </div>` : ""}
                                    <div>
                                        <label class="small">Data:</label>
                                        <label class="small">${new Date(item.created_at).toLocaleString()}</label>
                                    </div>
                                </a>
                            </li>
                        `
                    }).join('');
                    preload(false);

                    if (response.next_page_url)
                        document.querySelector('.list-notes').innerHTML += `<div class="show-more-notes-container"><button type="button" class="btn btn-primary btn-sm show-more-notes">Mostrar mais</button></div>`;

                    elementProperty.addEventInElement(".show-more-notes", "onclick", function () {
                        this.remove();
                        thisPage = response.current_page;
                        thisPage = thisPage + 1;
                        preload(true);
                        mountList(thisPage, true);
                    });
                });
            });
        });
    });
}

function getStars(note) {
    return [1, 2, 3, 4, 5].map(item => {
        return item <= parseInt(note) ? "<span class='material-icons' style='color: goldenrod' >star</span>" : "<span class='material-icons'>star</span>";
    }).join("")
}

function showValueBasic(value, valueDefault) {
    if (PermissionUser.hasPermission(MOTORISTA, "listar_basico"))
        return valueDefault;

    return value;
}


elementProperty.addEventInElement('#btn-page', 'onclick', function () {
    page++;
});

function verifyPrePaid(res) {
    if (PermissionUser.hasPermission(FINANCEIRO, "gerenciar_prepago")) {
        return `
            <div class="custom-control custom-switch mt-5">
              <input type="checkbox" class="custom-control-input change-prepaid" id="prepaid${res.idDriver}" idDriver="${res.idDriver}" ${res.prepaid == true ? "checked" : ""}>
              <label class="custom-control-label" for="prepaid${res.idDriver}">Apenas pré-pago</label>
            </div>
        `;
    }
    return '';
}

function getPermissionOptionDriver(res) {
    let options = "";
    if (PermissionUser.hasPermission(MOTORISTA, "bloquear_desbloquear"))
        options += `
        <div class="col-2 col-lg-12 mb-2">
        <button type="button"  class="blockDriver btn btn-primary" title="${res.driverRegisterStatusId === 1 ? 'Bloquear' : 'Desbloquear'}" id="${res.idDriver}" value="${res.driverRegisterStatusId === 1 ? 'Bloquear' : 'Desbloquear'}">
        <i  iduser="${res.idUser}" class="material-icons">
            ${res.driverRegisterStatusId === 1 ? 'lock_outline' : 'lock_open'}</i>
            </button>
        </div>
        `;
    if (PermissionUser.hasPermission(MOTORISTA, "editar"))
        if (!res.email.includes('motorista@teste.com')){
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Editar">
            <button class="editDriver btn btn-info" id="${res.idDriver}">
                <i class="material-icons" id="${res.idDriver}">edit</i>
            </button>
        </div>
        `;
        }
    if (PermissionUser.hasPermission(MOTORISTA, "editar"))
        if (!res.email.includes('motorista@teste.com')){
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Apagar">
            <button class="delete-driver btn btn-danger" id="${res.idDriver}">
                <i class="material-icons" id="${res.idDriver}">close</i>
            </button>
        </div>
        `;
        }
    if (PermissionUser.hasPermission(MOTORISTA, "resetar_senha"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Gerar senha padrão">
            <button class="btn generatePass" id="${res.idDriver}">
                <i title="Gerar senha padrão" class=" material-icons" id="${res.idDriver}">vpn_key</i>
            </button>
        </div>
        `;
    if (PermissionUser.hasPermission(MOTORISTA, "financeiro"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="listagem Financeira">
            <button class="btn btn-success open-financial" id="${res.idDriver}">
                <i id="${res.idDriver}" class=" material-icons">timeline</i>
            </button>
        </div>
        `;
    if (PermissionUser.hasPermission(MOTORISTA, "adicionar_saldo"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Adicionar ou remover saldo">
            <button class="add-and-remove-balance btn btn-info" id="${res.idDriver}">
                <i id="${res.idDriver}" class=" material-icons  "> attach_money</i>
            </button>
        </div>
        `;
    if (PermissionUser.hasPermission(FINANCEIRO, "zerar_saldo"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Zerar saldo">
            <button class="btn btn-danger reset-balance" name="${res.name}" id="${res.idDriver}" >
                <i title="Zerar saldo" name="${res.name}" id="${res.idDriver}" class=" material-icons ">money_off</i>
            </button>
        </div>
        `;
    if (PermissionUser.hasPermission(MOTORISTA, "editar"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Observações">
            <button class="btn btn-info btn-observation" id="${res.idDriver}">
                <i class="material-icons" id="${res.idDriver}">description</i>
            </button>
        </div>
        `;

    if (PermissionUser.hasPermission(MOTORISTA, "editar"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Configurações">
            <button class="btn btn-primary btn-config-driver" id="${res.idDriver}" >
                <i class="material-icons" id="${res.idDriver}">settings</i>
            </button>
        </div>
        `;

    if (PermissionUser.hasPermission(MOTORISTA, "editar"))
        options += `
        <div class="col-2 col-lg-12 mb-2" title="Notas do motorista">
            <button class="btn btn-note-driver" id="${res.idDriver}">
                <i class="material-icons" id="${res.idDriver}">star</i>
            </button>
        </div>
        `;

    return options;
}

elementProperty.addEventInElement('#close-modal-balance', 'onclick', function () {
    elementProperty.getElement('#modal-balance', modal => {
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
            return;
        }
        modal.classList.add('show');
    });
});

elementProperty.addEventInElement('#insert-balance', 'onclick', function () {
    preload(true);
    let valor = Mask.removeMaskMoney(document.getElementById('valueBalance').value);
    let id = idDriver;

    let data = {};
    data.value = valor;
    data.driverId = id;

    $('#modalBalance').modal('hide');

    DriverController.insertBalance(id, data).then(response => {
        if (response.status) {
            swal('Inserido com sucesso', response.message, 'success').then(() => mountList(1));
            preload(false);
            return;
        }
        preload(false);
        swal('Erro ao inserir', response.message, 'info');
    });
});

function getNameCity(cityId) {
    if(cityId){
        CityController.find(cityId).then(({ data }) => {
            console.log(data.nome)
            return data.nome
        })
    }
}

