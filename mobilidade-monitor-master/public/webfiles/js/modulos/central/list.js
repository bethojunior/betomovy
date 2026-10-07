document.addEventListener("DOMContentLoaded", function () {

    const objectAddCentral = {
        "centralId": "",
        "userId": "",
        "isAdmin": false
    };

    let filter = "";

    let currentPage = 1;

    showListCentral();
    showListPartnerCommission();
    Mask.setMoneyField("#voucherValue");
    Mask.setMoneyField("#voucher-list");

    elementProperty.addEventInElement("#filterInput", "onsearch", actionSearchByFilter);
    elementProperty.addEventInElement("#filterButton", "onclick", actionSearchByFilter);

    function actionSearchByFilter() {
        filter = document.querySelector("#filterInput").value;
        showListCentral();
    }

    function showListCentral() {
        preload(true);
        elementProperty.getElement("#listCentral", element => {
            CentralController.get(filter, currentPage).then(({response}) => {
                element.innerHTML = response.data.map((central) => {
                    return `<tr>
                                <td><span>${central.name}</span></td>
                                <td><span>${central.address}</span></td>
                                <td style="text-align: center">
                                    <span id="voucher-list">${Mask.maskMoney(central.tripBalance) || Mask.maskMoney(0)}</span>
                                </td>
                                <td>
                                 <a href="/central/edit/${central.id}">Editar</a>
                                </td>
                                <td style="text-align: center">
                                    <a href="#" class="open-modal-voucher" value='${JSON.stringify(central)}'>$</a>
                                </td>
                                <td>
                                    <a href="#" class="open-modal-partner" value='${JSON.stringify(central)}' >Usuários</a>
                                </td>
                                <td>
                                    <a href="#">
                                        <span class="material-icons remove-central" value="${central.id}" style="font-size: 14pt">delete</span>   
                                    </a>
                                </td>
                                <td>
                                    <div class="custom-control custom-switch">
                                      <input type="checkbox" value="${central.id}" class="custom-control-input toggle-status-central" id="customSwitch${central.id}" ${central.active == true ? "checked" : ""}>
                                      <label class="custom-control-label" for="customSwitch${central.id}"></label>
                                    </div>
                                </td>
                            </tr>`;
                }).join("");

                if (response.next_page_url != null) {
                    document.querySelector("#showEndButton").classList.remove("disabled");
                } else {
                    document.querySelector("#showEndButton").classList.add("disabled");
                }


                if (response.prev_page_url != null) {
                    document.querySelector("#showStartButton").classList.remove("disabled");
                } else {
                    document.querySelector("#showStartButton").classList.add("disabled");
                }

                initEventList(response);
            }).finally(() => {
                preload(false);
            })
        });
    }

    function initEventList(response) {
        elementProperty.addEventInElement("#showStartButton", "onclick", function () {
            currentPage = parseInt(response.current_page) - 1;
            showListCentral();
        });
        elementProperty.addEventInElement("#showEndButton", "onclick", function () {
            currentPage = parseInt(response.current_page) + 1;
            showListCentral();
        });
        elementProperty.addEventInElement(".open-modal-voucher", "onclick", function () {
            const central = JSON.parse(this.getAttribute("value"));
            updateVoucherValue(central);
        });
        elementProperty.addEventInElement(".open-modal-partner", "onclick", function () {
            const central = JSON.parse(this.getAttribute("value"));
            objectAddCentral.centralId = central.id;
            showUsersCentral(central.id);
        });

        elementProperty.addEventInElement(".toggle-status-central", "onclick", function () {
            const status = this.checked;

            CentralController.changeStatus(this.value, status ? "activate" : "block");
        });

        elementProperty.addEventInElement(".remove-central", "onclick", function () {
            const value = this.getAttribute("value");
            SwalCustom.dialogConfirm("Deseja apagar essa central", "", status => {
                if (status) {
                    preload(true);
                    CentralController.remove(value).then(({status, message}) => {
                        preload(false);
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            showListCentral();
                        })
                    })
                }
            })
        });

        elementProperty.addEventInElement("#addUserInCentral", "onclick", function () {
            objectAddCentral.isAdmin = document.getElementById("isAdmin").checked;

            if (objectAddCentral.userId.length === 0) {
                SwalCustom
                    .messageDialog("Nenhum parceiro selecionado", "Informe um parceiro", "info");
                return;
            }

            this.disabled = true;

            CentralUserController.insert(objectAddCentral)
                .then(({status, data, message, errors}) => {
                    if (!status) {
                        SwalCustom.messageDialog("", message, "info");
                        return;
                    }

                    SwalCustom.messageDialog("", message, "success");

                    showUsersCentral(objectAddCentral.centralId);

                    $('#modalAddUserInCentral').modal('hide')
                }).finally(() => {
                this.disabled = false;
            });
        });
    }

    function showListPartnerCommission() {
        preload(true);

        CentralController.listPartnerCommission().then(({status, response}) => {
            if (!status)
                return;

            document.querySelector("#listPartnerCommission").innerHTML = response.map(item => {
                if (!item.trip_type)
                    return '';
                return `<tr>
                     <td>${item.trip_type.type}</td>
                     <td>${Mask.maskMoney(item.partnerCommissionValue)}</td>
                     <td>${item.partnerCommissionType === "$" ? "Dinheiro" : "Percentagem"}</td>
                     <td>${item.city.nome}</td>
                     <td><a href="#" class="edit-partner-commission-central" value='${JSON.stringify(item)}'>Editar</a></td>
                     <td><a href="#" class="remove-partner-commission-central" value='${JSON.stringify(item)}'>Excluir</a></td>
                </tr>`;
            }).join("");

            elementProperty.addEventInElement(".remove-partner-commission-central", "onclick", function () {
                const central = JSON.parse(this.getAttribute("value"));

                SwalCustom.dialogConfirm("Deseja excluir comissão?", "", status => {
                    if (status) {
                        preload(true);
                        CentralController.deletePartnerCommission(central.id).then(({message, status}) => {
                            SwalCustom.messageDialog("", message, status ? "success" : "info");
                            showListPartnerCommission();
                        }).finally(() => {
                            preload(false);
                        })
                    }
                });
            });

            elementProperty.addEventInElement(".edit-partner-commission-central", "onclick", function () {
                const central = JSON.parse(this.getAttribute("value"));

                document.querySelector("#cityCommissionSelectEdit").value = central.cityId;
                document.querySelector("#typeCalledSelectEdit").value = central.tripTypeId;
                document.querySelector(`input[name='typeValuePartnerCommissionEdit'][value='${central.partnerCommissionType}']`).checked = true;
                document.querySelector("#valuePartnerCommissionEdit").value = Mask.maskMoney(central.partnerCommissionValue);
                $('#editPartnerCommissionModal').modal('show');

                elementProperty.addEventInElement("#btnEditPartnerCommission", "onclick", function () {
                    const commission = {
                        "tripTypeId": document.querySelector("#typeCalledSelectEdit").value,
                        "cityId": document.querySelector("#cityCommissionSelectEdit").value,
                        "partnerCommissionType": document.querySelector("input[name='typeValuePartnerCommissionEdit']:checked").value,
                        "partnerCommissionValue": Mask.removeMaskMoney(document.querySelector("#valuePartnerCommissionEdit").value)
                    };

                    preload(true);

                    CentralController.editPartnerCommission(central.id, commission).then(({message, status}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            if (status)
                                $('#editPartnerCommissionModal').modal('hide');
                        });
                        showListPartnerCommission();
                    }).finally(() => preload(false))

                });
            });

        }).finally(() => preload(false));

        TripTypeController.getAll().then((result) => {
            const list = result.response.map(item => {
                return `<option value="${item.idTripType}">${item.type}</option>`
            }).join("");

            document.querySelector("#typeCalledSelect").innerHTML = list;
            document.querySelector("#typeCalledSelectEdit").innerHTML = list;
        });

        const listCities = Session.getLocal64("cities").map(city => {
            return `<option value="${city.cityId}">${city.nome}</option>`
        }).join("");

        document.querySelector("#cityCommissionSelect").innerHTML = listCities;
        document.querySelector("#cityCommissionSelectEdit").innerHTML = listCities;

        Mask.setMoneyField("#valuePartnerCommission");
        Mask.setMoneyField("#valuePartnerCommissionEdit");

        elementProperty.addEventInElement("#btnAddPartnerCommission", "onclick", () => {
            const commission = {
                "tripTypeId": document.querySelector("#typeCalledSelect").value,
                "cityId": document.querySelector("#cityCommissionSelect").value,
                "partnerCommissionType": document.querySelector("input[name='typeValuePartnerCommission']:checked").value,
                "partnerCommissionValue": Mask.removeMaskMoney(document.querySelector("#valuePartnerCommission").value)
            };

            if (commission.partnerCommissionValue <= 0)
                return alert("Informe o valor da comissão");

            preload(true);

            CentralController.insertPartnerCommission(commission).then(({message, status}) => {
                SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                    if (status)
                        $('#addPartnerCommissionModal').modal('hide');
                });
                showListPartnerCommission();
            }).finally(() => preload(false))
        });
    }

    function updateVoucherValue(central) {
        $('#voucherModal').modal('show');

        elementProperty.addEventInElement("#updateVoucher", "onclick", () => {
            var data = {
                centralId: central.id,
                type: document.getElementById('inserOrRemove').value,
                value: Mask.removeMaskMoney(document.getElementById('voucherValue').value)
            }

            if(data.value == 0)
            return SwalCustom.messageDialog("", "valor não pode ser zero", "info")

            preload(true)
            CentralController.updateVoucherValue(data).then(({status, message}) => {
                $('#voucherModal').modal('hide');
                preload(false);
                showListCentral()
                return SwalCustom.messageDialog("", message, status ? "success" : "error")
            })
        })
    }

    function showUsersCentral(idCentral) {
        preload(true);
        CentralUserController.get(idCentral).then((data) => {
            console.log(data)
            elementProperty.getElement(`#listPartnerCentral`, element => {
                element.innerHTML = data.response.map((item) => {
                    return `<li class="list-group-item">
                                <i 
                                    class="material-icons remove-user-central float-right" 
                                    idCentral="${item.centralId}"
                                    idUser="${item.user.idUser}"
                                    style="cursor: pointer">close</i>
                                <p class="m-0">${item.user.name}</p>
                                <p class="m-0">${item.user.email}</p>
                             </li>`;
                }).join("");

                $('#listPartnerModal').modal('show');

                elementProperty.addEventInElement(".remove-user-central", "onclick", function () {
                    SwalCustom.dialogConfirm("Deseja remover parceiro da central?", "", status => {
                        if (!status)
                            return;
                        preload(true);
                        CentralUserController
                            .removeUser(this.getAttribute("idCentral"), this.getAttribute("idUser"))
                            .then(() => {
                                showUsersCentral(this.getAttribute("idCentral"));
                            }).finally(() => preload(false));
                    });
                })
            });
        }).finally(() => preload(false));
    }

    $('#partnerSelected').select2({
        placeholder: 'Selecione o usuário',
        width: '100%',
        ajax: {
            url: environment.hosts.hostRequestNew + "report/select2/customers/withUser",
            headers: {
                'token': Session.getValueInSession('user', 'api_token'),
                'userid': Session.getValueInSession('user', 'idUser')
            },
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                };
            },
            processResults: function (result, params) {
                params.page = params.page || 1;

                return {
                    results: result.response.map(partner => {
                        return {
                            id: partner.id,
                            text: partner.text,
                            nameEstablishment: partner.nameEstablishment ?? null,
                            email: partner.email,
                            phone: partner.phone
                        }
                    }),
                };
            },
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatSelecting,
        templateSelection: formatRepoSelection
    });


    function formatSelecting(result) {
        if (result.loading) {
            return "Buscando...";
        }

        return `<div class="item-select2">
                    <div>
                        <p><span>Nome:</span> ${result.text}</p>
                        <p><span>Estabelecimento:</span> ${result.nameEstablishment}</p>
                        <p><span>E-mail:</span> ${result.email}</p>
                         <p><span>Telefone:</span> ${result.phone}</p>
                    </div>
                </div>`;
    }

    function formatRepoSelection(result) {
        objectAddCentral.userId = result.id;
        return result.text;
    }
});