
preload(true);
const elementProperty = new ElementProperty();
let pathImage = environment.hosts.hostImageClient;
let pathImageDefault = environment.hosts.hostImageDefault;
let userPendency = '';
let pendencies = [];
let listStatusPendencies = [];
let thisPage = 1;
let lastPage = 0;
let isBlocked = "BLOQUEADO";
let timeoutSearch = null;
let city = Session.getLocal('citySelected');
let cityId = city.cityId;
let keyDataClient = Session.get('hide_information_client_and_driver')
var message = '';

$('.collapse').collapse();

elementProperty.addEventInElement('#do-filter', 'onkeyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-costumer").click();
    }
});

ClientController.messageWhatsapp().then(({ response }) => {
    message = response;
});

preload(true);
ClientController.getCustomerRegisterStatus().then(({ response }) => {
    document.querySelector("#statusControlSelected").innerHTML += response.map(item => {
        return `<option value="${item.idCustomerRegisterStatus}">${item.name}</option>`
    }).join("");

    document.querySelector("#statusControlSelectedMobile").innerHTML += response.map(item => {
        return `<option value="${item.idCustomerRegisterStatus}">${item.name}</option>`
    }).join("");

    preload(false);

    document.querySelector('#statusControlSelected').value = 2;
    document.querySelector('#statusControlSelectedMobile').value = 2;
    mountList('', '', '', false);
});

elementProperty.addEventInElement('.search-costumer', 'onclick', function () {
    const valueStatus = document.querySelector("#statusControlSelected").value;
    if (document.querySelector('input[name="filter-costumers"]:checked') == null)
        return swal('Nenhum filtro selecionado', 'Identifique qual tipo de filtro quer aplicar', 'info');

    const filterType = document.querySelector('input[name="filter-costumers"]:checked').value;
    const filterValue = document.querySelector('#do-filter').value;
    
    if (filterType === 'phone') {
        return filterPhoneLocal(filterValue);
    }

    preload(true);
    mountList(1, false, false, valueStatus);
});

elementProperty.addEventInElement('#search-costumer-mobile', 'onclick', function () {
    let valueSearch = document.getElementById('do-filter-mobile').value;
    if (document.querySelector('input[name="filter-costumers"]:checked') == null)
        return swal('Nenhum filtro selecionado', 'Identifique qual tipo de filtro quer aplicar', 'info');
    let filterCostumers = document.querySelector('input[name="filter-costumers"]:checked').value;
    
    if (filterCostumers === 'phone') {
        return filterPhoneLocal(valueSearch);
    }
    
    preload(true);
    mountList(1, false, '', valueSearch);
});

elementProperty.addEventInElement('#search-by-military', 'onclick', function () {
    let military = {
        'militaryGraduationId': '',
        'militaryForceId': ''
    };
    military.militaryForceId = document.getElementById('mount-military').value;
    military.militaryGraduationId = document.getElementById('graduationMilitary').value;
    mountList('', false, military);
    $('#modal-filter-military').modal('hide');
});

elementProperty.addEventInElement('#open-modal-filter-military', 'onclick', function () {
    $('#modal-filter-military').modal('show');
    preload(true);
    ClientController.getTypeMilitary().then(({ response }) => {
        elementProperty.getElement('#mount-military', these => {
            let content = '';
            content += response.map(item => {
                return `
                    <option value="${item.id}">${item.name}</option>
                `;
            }).join('');
            these.innerHTML = content;
            preload(false);
        });
    });
});

elementProperty.addEventInElement('#mount-military', 'onclick', function () {
    preload(true);
    ClientController.getGraduationMilitary(this.value).then(({ response }) => {
        elementProperty.getElement('#graduationMilitary', these => {
            let content = '';
            content += response.map(item => {
                return `
                    <option value="${item.id}">${item.patent}</option>
                `;
            }).join('');
            these.innerHTML = content;
            preload(false);
        });
    })
});

elementProperty.addEventInElement('#clear-filter', 'onclick', function () {
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

function isNull(field) {
    if (field === null || field === '' || field === undefined) {
        return 'Não informado';
    }
    return field;
}

function formatDateOfBirth(date) {
    let dateBirth = date;

    if (dateBirth === null || dateBirth === '' || dateBirth === undefined) {
        return 'Não informado';
    }
    return new Date(dateBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

elementProperty.addEventInElement("#statusControlSelected", "onchange", function () {
    preload(true);
    mountList();
});

elementProperty.addEventInElement("#statusControlSelectedMobile", "onchange", function () {
    $('#collapseOne').collapse('hide');
    preload(true);
    mountList();
});

function detectar_mobile() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function filterPhoneLocal(searchValue) {
    preload(true);
    
    const customerItems = document.querySelectorAll('.data-customer-item');
    let hasVisibleItems = false;
    
    customerItems.forEach(item => {
        let phoneFound = false;
        
        const phoneInputs = item.querySelectorAll('input');
        phoneInputs.forEach(input => {
            if (input.value && input.value.match(/\d{2,}/)) { // Busca por inputs com números (telefone)
                const phoneValue = input.value.toLowerCase();
                const searchText = searchValue.toLowerCase();
                
                if (phoneValue.includes(searchText)) {
                    phoneFound = true;
                }
            }
        });
        
        if (phoneFound || searchValue === '') {
            item.style.display = '';
            hasVisibleItems = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    preload(false);
    
    if (!hasVisibleItems && searchValue !== '') {
        swal('Nenhum resultado encontrado', 'Não foram encontrados clientes com esse telefone', 'info');
    }
}

function mountList(page = 1, concat = false, military = false, status = false) {
    preload(true);
    const valueStatusWeb = document.querySelector("#statusControlSelected").value;
    const valueStatusMobile = document.querySelector("#statusControlSelectedMobile").value;

    const customerRegisterStatusId = detectar_mobile() ? valueStatusMobile : valueStatusWeb;
    const filter = { customerRegisterStatusId };
    
    const filterType = document.querySelector("input[name='filter-costumers']:checked")?.value;
    const filterValue = detectar_mobile()
        ? document.querySelector("#do-filter-mobile").value
        : document.querySelector("#do-filter").value;
    
    // Se for filtro por telefone, usar filtro local
    if (filterType === 'phone' && filterValue) {
        return filterPhoneLocal(filterValue);
    }
    
    if (filterType && filterValue) {
        filter[filterType] = filterValue;
    }

    if (military) {
        filter['militaryForceId'] = military.militaryForceId
        filter['militaryGraduationId'] = military.militaryGraduationId
    }

    elementProperty.getElement('#mountListCostumers', element => {

        ClientController.getCustomerList(page, filter).then(({ response }) => {
            preload(false);

            const { data } = response;
            lastPage = response.last_page;
            let list = concat ? element.innerHTML : "";
            if (data.length === 0) {
                preload(false);
                return swal('Não há dados para seu filtro', '', 'info');
            }
            list += data.map(res => {
                let status = checkStatusColor(res.status);
                return `
                    <li id="${res.idCustomer}" class="data-customer-item">
                        <div class="row">
                            <div class="col-lg-2 container-profile-customer">
                                <div class="col-lg-12 p-0">
                                    <div class="col-lg-12">
                                        <div class="profile-customer" style="background-image: url(${environment.hosts.hostImageClient + res.profileImage})" onerror="this.src = environment.hosts.hostImageDefault"></div>
                                    </div>
                                    ${isDependent(res)}
                                 </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <span>Cliente</span> 
                                    <input class="form-control" value="${res.name}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>CPF</span>
                                    <input class="form-control" value="${keyDataClient == 0 ? isNull(res.document) : ""}" disabled>
                                </div>
                                <div class="form-group">
                                ${keyDataClient == 0 ? `<a target="_blank" href='https://api.whatsapp.com/send?phone=55${res.phone}&text=${message}'>
                                <img src="/webfiles/img/icon/whatsapp.png"> </a>`: ""}
                                    <span>Telefone</span>
                                    <input class="form-control" value="${keyDataClient == 0 ? res.phone || 'Não informado' : ""}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>E-mail</span>
                                    <input class="form-control" value="${keyDataClient == 0 ? res.email : ""}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Data de Nascimento</span>
                                    <input class="form-control" value="${formatDateOfBirth(res.dateOfBirth)}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Plataforma do app</span> 
                                    <input class="form-control" value="${res.platform || "Não identificado"}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Status</span> 
                                    <input class="form-control" value="${res.status || "Não identificado"}" disabled>
                                </div> 
                                <!-- div class="form-group">
                                    <span>Força militar</span>
                                    <input class="form-control" value="${isNull(res.militaryForce)}" disabled>
                                </div -->
                                <!-- div class="form-group">
                                    <span>Patente</span>
                                    <input class="form-control" value="${isNull(res.patent)}" disabled>
                                </div-->
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <span>Criado em</span>
                                    <input class="form-control" value="${Mask.setDateCrazy(res.created_at)}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Viagens finalizadas </span>
                                    <input class="form-control" value="${res.quantityTripsFinished || 0}" disabled>
                                </div>                                                    
                                <div class="form-group">
                                    <span>Saldo </span>
                                    <input class="form-control" value="R$${showValueBasic(Mask.maskMoney(parseFloat(res.comission)), 0)}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Voucher</span> 
                                    <input class="form-control" value="R$${Mask.maskMoney(parseFloat(res.voucherBalance))}" disabled>
                                </div>  
                                <div class="form-group">
                                    <span>RG</span> 
                                    <input class="form-control" value="${res.rg || "Não informado"}" disabled>
                                </div>
                                <div class="form-group">
                                    <span>Versão do app</span> 
                                    <input class="form-control" value="${res.appVersion || "Não identificado"}" disabled>
                                </div>
                            </div>
                            <div class="container-buttons-actions col-lg-2">
                                ${createPermissionByUser(res)} 
                            </div>
                               <div class="col-12">
                                <div>
                                <div class="card-header col-lg-12" id="headingOne">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne-${res.idCustomer}" aria-expanded="true" aria-controls="collapseOne-${res.idCustomer}">
                                            Imagens
                                        </button>
                                    </h2>
                                </div>
                            
                                <div id="collapseOne-${res.idCustomer}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div class="card-body"> 
                                        <div class="row col-lg-12"> 
                                            <div class="col-lg-3"> 
                                                <img class="col-lg-12" src="${res.rgFrontPicture}" onerror="this.src = '${environment.hosts.hostImageDefault}'">
                                            </div>
                                            <div class="col-lg-3"> 
                                                <img class="col-lg-12" src="${res.rgBackPicture}" onerror="this.src = '${environment.hosts.hostImageDefault}'">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        ${createModals(res)}
                    </li>
                `;
            }).join("");

            if (response.next_page_url)
                list += `<li ><button type="button" class="show-more-customer">Mostrar mais</button></li>`;

            element.innerHTML = list;
            Mask.setMoneyField('.value-voucher', "100000");
            Mask.setMaskPhone('.field-phone');
            Mask.setMaskCpf('.field-cpf');
            Mask.setMaskDateBirth('.field-dateBirth');
            preload(false);
            elementProperty.addEventInElement('.editPass', 'onclick', function () {
                let data = {};
                data.idCostumer = this.getAttribute('id');
                data.password = TEMPLATE_PASSWORD;
                SwalCustom.dialogConfirm('Deseja alterar a senha do usuário para a senha padrão - ' + TEMPLATE_PASSWORD, 'Essa ação é irreversivel', callback => {
                    if (callback) {
                        preload(true);
                        ClientController.update(data).then(res => {
                            preload(false);
                            if (res.status)
                                return swal('', res.message, 'success');

                            return swal('ops', res.message, 'error');
                        })
                    }
                });
            });

            elementProperty.addEventInElement('.btn-insert-pendencies', 'onclick', function () {
                userPendency = this.getAttribute('id');
                $('#modal-pendecies').modal('show');
                document.querySelector("#listPendency").selectedIndex = 0;
                document.querySelector("#statusPendency").selectedIndex = 0;

                elementProperty.getElement('#pendecies-user', these => {
                    these.innerHTML = ' ';
                    ClientController.getUserPendencies(userPendency).then(({ status, response }) => {
                        if (!status)
                            return swal('Erro ao listar pendencias do usuário', 'Contate o suporte', 'error');

                        let content = '';
                        content += response.map(item => {
                            return `
                                <tr>
                                    <td>${item.pendency_field_type.description}</td>
                                    <td><select class="custom-select" idPendency="${item.id}" onchange="changeStatusPendency(this)">${createListStatusPendency(item.pendency_field_status)}</select></td>
                                </tr>
                            `;
                        }).join('');
                        if (content === '' || content === ' ')
                            return these.innerHTML = 'Não há pendencias pra esse usuário';
                        return these.innerHTML += content;
                    });
                });
            });

            elementProperty.addEventInElement(".show-more-customer", "onclick", function () {
                this.remove();
                thisPage = thisPage + 1;
                preload(true);
                mountList(thisPage, true);
            });

            elementProperty.addEventInElement('.add', 'onclick', function () {
                let myId = this.getAttribute('id');
                elementProperty.getElement('#options' + myId, _that => {
                    if (_that.classList.contains("show"))
                        return _that.classList.remove("show");

                    elementProperty.getElement('#modal' + myId, divModal => {
                        divModal.classList.add('show');
                    });
                    _that.classList.add("show");
                });
            });

            elementProperty.addEventInElement('.addVoucher', 'onclick', function () {
                let id = this.getAttribute('id');

                $(`#modalVoucher${id}`).modal('show');
            });

            elementProperty.addEventInElement('.insertVoucher', 'onclick', function () {
                let data = {};
                data.idCostumer = this.getAttribute('id');
                const voucherValue = document.querySelector(`.balance${data.idCostumer}`).value;
                data.balance = Mask.removeMaskMoney(voucherValue);

                elementProperty.getElement('#action' + data.idCostumer, action => {
                    data.action = action.value;
                });

                ClientController.insertVoucherClient(data).then(res => {
                    if (res.status) {
                        $(`#modalVoucher${data.idCostumer}`).modal('hide');
                        swal('', res.message, 'success');
                        return mountList();
                    }
                    swal('ops', res.message, 'error');
                });
            });

            elementProperty.addEventInElement('.closeModal', 'onclick', function () {
                let id = this.getAttribute('id');
                closeModalById(id);
            });

            elementProperty.addEventInElement('.btnBlocked', 'onclick', function () {
                let status = this.getAttribute('status');
                if (status === 'Bloquear') {
                    swal({
                        title: "Cuidado",
                        text: 'Ao aceitar, irá bloquear o cliente',
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                ClientController.blockCustomer(this.getAttribute('id')).then(res => {
                                    if (res.status) {
                                        swal('', res.message, 'success');
                                        return mountList();
                                    }
                                    swal('ops', res.message, 'error');
                                });
                            } else {
                                swal("Ação desfeita");
                            }
                        });
                    return;
                }
                if (status === 'Desbloquear') {

                    preload(true);
                    SettingController.getExternalServicesByCity(cityId).then((result) => {
                        if (!result.response[2].external_services[0].active) {
                            return ClientController.unlockCustomer(this.getAttribute('id')).then(resolve => {
                                preload(false);
                                if (resolve.status) {
                                    swal('', resolve.message, 'success');
                                    mountList();
                                }
                            });
                        } else {
                            ClientController.criminalRecord(this.getAttribute('id')).then(result => {
                                preload(false);
                                if (!result.status) {
                                    preload(false);
                                    return SwalCustom.messageDialog('Existem dados inconsistentes no cadastro do cliente', `${result.response[0]}`, 'info');
                                }
                                $('#modalCriminalRecord').modal('show');
                                document.querySelector('.btn-unlock').value = this.getAttribute('id');
                                document.querySelector('.modal-result').innerHTML = `
                                <div class="text-justify">${result.response[0].mensagem}</div>
                                <a href='${result.response[0].site_receipt}' target="_blank" class="mt-2 material-icons" style="color: black; font-size: 35px">picture_as_pdf</a>
                                `;
                            });
                        }
                    });
                }
                closeModalById(this.getAttribute('id'));
            });

            elementProperty.addEventInElement('.btn-unlock', 'onclick', function () {
                preload(true);
                const id = document.querySelector('.btn-unlock').value;
                ClientController.unlockCustomer(id).then(resolve => {
                    preload(false);
                    if (resolve.status) {
                        swal('', resolve.message, 'success');
                        mountList();
                    }
                });
            });

            elementProperty.addEventInElement('.editUser', 'onclick', function () {
                let id = this.getAttribute('id');
                elementProperty.getElement('#modalEdit' + id, element => {
                    if (element.classList.contains('show'))
                        return element.classList.remove('show');

                    closeModalById(id);
                    element.classList.add('show');
                });
            });

            elementProperty.addEventInElement('.deletar', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar esse cliente?', 'Essa ação é irreversível').then(status => {
                    if (!status)
                        return true;

                    preload(true);
                    ClientController.deleteUser(id).then(({ status, response, message }) => {
                        preload(false);
                        if (status)
                            return swal('', message, 'success');

                    });
                });
            });

            elementProperty.addEventInElement('.closeModalEdit', 'onclick', function () {
                closeModalById(this.getAttribute('id'));
            });

            elementProperty.addEventInElement('.btn-observation', 'onclick', function () {
                preload(true);
                $('#modalObservation').modal('show');
                ClientController.getObservation(this.id).then(({ response }) => {
                    document.querySelector('.observation-edit').setAttribute("id", response.idUser);
                    document.querySelector('.observation-input').value = response.observation || "";
                    preload(false);
                })
            });

            elementProperty.addEventInElement('.btn-dependent', 'onclick', function () {
                preload(true);
                ClientController.getDependents(this.id, city).then(({ response }) => {
                    const { dependents } = response;
                    if (dependents.length === 0) {
                        preload(false);
                        return swal('Não há dependentes para esse usuário', '', 'info');
                    } else {
                        $('#modalDependent').modal('show');
                        document.querySelector('.list-dependents').innerHTML = dependents.map(item => {
                            return `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.email}</td>
                                    <td>${item.phone}</td>
                                    <td>${item.relationship == null ? 'Não informado' : item.relationship}</td>
                                </tr>
                            `;
                        }).join('');
                        preload(false);
                    }
                });
            });

            elementProperty.addEventInElement('.observation-edit', 'onclick', function () {
                preload(true);
                const observationInputValue = document.querySelector('.observation-input').value;
                const data = {};
                data.observation = observationInputValue;
                ClientController.createObservation(this.id, data).then(() => {
                    status = true ? SwalCustom.messageDialog(" ", "Salvo com sucesso!", "success") :
                        SwalCustom.messageDialog(" ", "Ops, ocorreu um erro ao salvar sua observação", "error");
                    preload(false);
                });
            });

            elementProperty.addEventInElement('.btn-document', 'onclick', function () {
                document.querySelector('.list-documents-user').innerHTML = "";
                preload(true);
                const userId = this.id;
                $('#documentModal').modal('show');
                ClientController.getDocumentsCustomer(userId).then(({ response }) => {
                    preload(false);
                    document.querySelector('.list-documents-user').innerHTML = response.map(item => {
                        return `
                            <div ${item.isImage === 1 ? `data-src="${item.image}"` : ""} class="col-4 ${item.isImage === 1 ? "gallery-photo" : ""} ">
                                <div class="card item-gallery card-document">
                                    ${item.isImage === 1
                                ? `<img src="${item.image}" class="card-img-top img-document" alt="...">`
                                : `<div class="material-icons align-self-center icon-document">description</div>`
                            }
                                    <div class="card-body d-flex flex-column card-document-details">
                                        <h6 class="card-title align-self-center font-weight-bold">${item.label}</h6>
                                        <p class="card-text align-self-center">${item.text ? item.text : ''} </p>
                                        <a href="#" class="material-icons align-self-end mt-1">visibility</a>
                                    </div>
                                </div>
                            </div>
                        `
                    }).join('');
                    const content = $("#contentGallery");

                    content.lightGallery();
                    content.data('lightGallery').destroy(true);

                    $("#contentGallery").lightGallery({ selector: ".gallery-photo" });
                });

            });

            elementProperty.addEventInElement('.btnSalvar', 'onclick', function () {
                let data = {};
                let id = this.getAttribute('id');
                let gender = document.querySelector(`#selectGender${id}`).value;
                data.idCostumer = id;

                if (gender === "")
                    return swal('', 'Selecione o gênero do cliente', 'error');

                elementProperty.getElement('#name' + id, name => {
                    data.name = name.value;
                });

                elementProperty.getElement('#document' + id, document => {
                    data.document = document.value;
                });

                elementProperty.getElement('#email' + id, email => {
                    data.email = email.value;
                });

                elementProperty.getElement('#phone' + id, phone => {
                    data.phone = phone.value;
                });

                elementProperty.getElement('#dateOfBirth' + id, dateOfBirth => {
                    data.dateOfBirth = dateOfBirth.value;
                    data.dateOfBirth = data.dateOfBirth.split('-').reverse().join('-');
                });

                data.gender = gender;

                ClientController.update(data).then(res => {
                    if (res.status) {
                        swal('', res.message, 'success');
                        return mountList();
                    }
                    swal('ops', res.message, 'error');
                });

            });
        });
    });

    function closeModalById(id) {
        elementProperty.getElement('#modalEdit' + id, element => {
            element.classList.remove('show');
        });

        elementProperty.getElement('#options' + id, _that => {
            _that.classList.remove("show");
        });

        elementProperty.getElement('#modal' + id, divModal => {
            divModal.classList.remove('show');
        });
    }

    function checkStatusColor(color) {
        if (color === "ATIVO") {
            return "green";
        }
        return "red";
    }

    function isDependent(data) {
        if (data.isDependent) {
            if (data.responsible)
                return `
                <div class="col-lg-12 patente">  
                    <hr />
                    <small>Dependente de <b>${data.responsible.name}</b></small>
                </div>
            `;
        }
        return ''
    }

    function showValueBasic(value, valueDefault) {
        if (PermissionUser.hasPermission(CLIENTE, "listar_basico"))
            return valueDefault;

        return value;
    }

    function createModals(res) {
        console.log(res);
        return `
            <div class="modal fade" id="modalVoucher${res.idCustomer}" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="titleModalVoucher">Inserir ou Remover voucher</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <label for="Value">Valor</label>
                    <input class="form-control value-voucher balance${res.idCustomer}" placeholder="Valor" type="number">
                    <label for="Options">Opções</label>
                    <select class="form-control" id="action${res.idCustomer}">
                        <option value='insert'>Inserir</option>
                        <option value='block'>Remover</option>
                    </select>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary insertVoucher" id="${res.idCustomer}">Finalizar em ${res.name}</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modalEditUser" id="modalEdit${res.idCustomer}">
           <div class="modalUser">
                <i id="${res.idCustomer}" class="material-icons closeModalEdit">close</i>
                <input value="${res.name}" id="name${res.idCustomer}" placeholder="Nome"><br>
                <input class="field-cpf" value="${res.document}" id="document${res.idCustomer}" placeholder="Cpf"><br>
                <input value="${res.email}" id="email${res.idCustomer}" placeholder="Email" type="email"><br>
                <input class="field-phone" value="${res.phone}" id="phone${res.idCustomer}" placeholder="Telefone" type='tel'><br>
                <input class="field-dateBirth"  value="${res.dateOfBirth !== null ? `${formatDateOfBirth(res.dateOfBirth)}` : ''}" id="dateOfBirth${res.idCustomer}" placeholder="Data de Nascimento"><br>
                <select class="form-control"  id="selectGender${res.idCustomer}">
                        <option ${res.gender == null && "selected"} value="">Selecione um gênero</option>
                        <option ${res.gender === "masculino" && "selected"} value="masculino">masculino</option>
                        <option ${res.gender === "feminino" && "selected"} value="feminino">feminino</option>
                </select>
                <button id="${res.idCustomer}" class="btnSalvar">Salvar</button>    
           </div>
        </div>`;
    }
}

function createPermissionByUser(res) {
    let lista = '';
    if (PermissionUser.hasPermission(CLIENTE, "bloquear"))
        lista += `
            <button id="${res.idCustomer}" class="m-1 btn btn-warning btnBlocked" status="${checkStatus(res.status)}">${checkStatus(res.status)}</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, "bloquear"))
        lista += `
            <button id="${res.idUser}" class="m-1 btn btn-warning btn-insert-pendencies" status="${checkStatus(res.status)}">Pendência</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, "editar")) {
        if (!res.email.includes('cliente@teste.com')) {
            lista += `
            <button id="${res.idCustomer}" class="m-1 btn btn-info editUser" >Editar</button>
        `;
        }
    }

    if (PermissionUser.hasPermission(CLIENTE, "excluir")) {
        if (!res.email.includes('cliente@teste.com')) {
            lista += `
            <button id="${res.idUser}" class="m-1 btn btn-danger deletar">Deletar</button>
        `;
        }
    }

    if (PermissionUser.hasPermission(CLIENTE, "resetar_senha"))
        lista += `
            <button id="${res.idCustomer}" class="m-1 btn btn-secondary editPass">Senha padrão</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, "inserir_voucher"))
        lista += `
            <button id="${res.idCustomer}" class="m-1 btn addVoucher">Voucher</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, "editar"))
        lista += `
            <button id="${res.idCustomer}" class="m-1 btn btn-primary btn-observation">Observações</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, "editar"))
        lista += `
            <button id="${res.idUser}" class="m-1 btn btn-info btn-document">Documentos</button>
        `;
    if (PermissionUser.hasPermission(CLIENTE, 'filtro_militar'))
        lista += `
            <button id="${res.idCustomer}" class="m-1 btn btn-info btn-dependent">Dependentes</button>
        `;

    return lista;
}

function createListDependencyCustomer(customer) {
    if (customer.dependents.length === 0)
        return '';

    return `<div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12 title-dependency-item" data-toggle="collapse" href="#collapseDependency${customer.id}" role="button" aria-expanded="false" aria-controls="#collapseDependency${customer.id}">Dependentes</div>
                    <div class="collapse" id="collapseDependency${customer.id}">
                         <div class="card card-body">
                            <ul class="list-group">
                                ${customer.dependents.map(item => {
        return `<li class="list-group-item">
                                                <p><span>Nome:</span><span> ${item.name}</span></p>
                                                <p><span>Paretesco:</span><span> ${item.relationship || "Não Informado"}</span></p>
                                                <p><span>Telefone: </span><a href="https://api.whatsapp.com/send?phone=55${getPhone(item.phone)}&text=${getMessageSupport()}" target="_blank">${item.phone}</a></p>
                                            </li>`
    }).join("")}    
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;
}

function getMessageSupport() {
    return encodeURI(`Olá, somos o suporte ${NAME_APP}!`);
}

function getPhone(phone) {
    if (phone == null)
        return "";
    return phone.match(/\d+/)
}


function checkStatus(status) {
    if (status === "ATIVO") {
        return "Bloquear";
    }
    return "Desbloquear";
}

elementProperty.addEventInElement('#insert-pendencies-user', 'onclick', function () {
    let data = {
        "pendencies": [
            {
                userId: userPendency,
                pendencyFieldTypeId: document.querySelector("#listPendency").value,
                pendencyFieldStatusId: document.querySelector("#statusPendency").value
            }
        ]
    };

    if (document.querySelector("#listPendency").value.length <= 0)
        return alert("Informe o tipo de pendencia");

    if (document.querySelector("#statusPendency").value.length <= 0)
        return alert("Informe o status da pendencia");

    preload(true);

    $('#modal-pendecies').modal('hide');
    ClientController.insertPendency(data).then(({ status, response }) => {
        preload(false);
        if (!status)
            return swal('Erro ao inserir pendencias', response[0], 'error');

        swal('Status alterado com sucesso', '', 'success');
    });
});

elementProperty.getElement('#listPendency', these => {
    ClientController.getPendency().then(({ status, response }) => {
        if (!status)
            return swal('Erro ao listar pendencias', 'Contate o suporte', 'info')

        let content = '<option value="" disabled selected>Selecione o tipo de pendencia</option>';
        content += response.map(item => {
            return `<option value="${item.id}">${item.description}</option>`;
        }).join('');

        these.innerHTML = content;
    });
});

ClientController.getPendencyFieldStatus().then(({ status, response }) => {
    if (!status)
        return swal('Erro ao listar pendencias', 'Contate o suporte', 'info');

    listStatusPendencies = response;
});


elementProperty.getElement('#statusPendency', these => {
    ClientController.getPendencyFieldStatus().then(({ status, response }) => {
        if (!status)
            return swal('Erro ao listar pendencias', 'Contate o suporte', 'info');

        let content = '<option value="" disabled selected>Selecione o status da pendencia</option>';
        content += response.map(item => {
            return `<option value="${item.id}">${item.name}</option>`;
        }).join('');

        these.innerHTML = content;

        elementProperty.getElement("", element => {
            element.innerHTML = content;
        });
    });
});

function createListStatusPendency(status) {
    return listStatusPendencies.map(item => {
        return `<option value="${item.id}" ${status.id == item.id ? "selected" : ""}>${item.name}</option>`;
    }).join('');
}

function changeStatusPendency(elemnt) {
    preload(true);
    ClientController.updateStatusPendency(elemnt.getAttribute("idPendency"), elemnt.value).then(({ status, response, message }) => {
        if (!status)
            return swal('Erro ao atualizar status da pendencia', response[0], 'info');

        swal("Pendencia atualizada com sucesso!", "", "success");

        mountList();
    }).finally(() => {
        preload(false);
    })
}