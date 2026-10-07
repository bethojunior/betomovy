document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    mountRoutes();

    let companyId = null;

    elementProperty.addEventInElement('#search-route', 'oninput', function () {
        let search = this.value.toUpperCase();
        elementProperty.getElement('.data-route', route => {
            let exists = route.getAttribute('name').toUpperCase();
            if (!exists.startsWith(search)) {
                route.style.display = 'none';
            } else {
                route.style.display = 'block';
            }
        });
    });

    function mountRoutes() {
        RouteController.listRoutes().then(({response}) => {
            preload(false);

            if(response.length == '0'){
                document.querySelector('.table-container').style.display = 'none';
                document.querySelector('.container').style.display = 'flex';
                document.querySelector('.container').style.justifyContent = 'center';
                document.querySelector('.container').innerHTML = `<h5>Não há rotas para a cidade selecionada</h5>`
            }

            document.querySelector("#listRoutes").innerHTML = response.map(item => {
                return `<tr>
                            <td>${item.name}</td>
                            <td>${item.origin.address}</td>
                            <td>${item.destination.address}</td>
                            <td><a href="#" class="change-status-route" value='${JSON.stringify(item)}'>${item.active == true ? "Desativar" : "Ativar"}</a></td>
                            <td><a href="#" class="btn btn-info user-corporate-route material-icons" value='${window.btoa(JSON.stringify(item))}'>person</a></td>
                            <td><a href="#" class="btn btn-dark show-detail-route" value='${window.btoa(JSON.stringify(item))}'><i class="material-icons">apps</i></a></td>
                            <td><button class="btn btn-primary material-icons btn-route-edit" id="${item.id}">edit</button></td>
                            <td><button type="button" class="btn btn-danger btn-route-remove material-icons" item='${window.btoa(JSON.stringify(item))}'>delete</button></td>
                    </tr>`;
            }).join('');

            elementProperty.addEventInElement(".btn-route-remove", "onclick", function () {
                const item = JSON.parse(window.atob(this.getAttribute("item")));

                SwalCustom.dialogConfirm("Atenção", "Deseja remover esta rota?", (status) => {
                    if(!status)
                        return SwalCustom.messageDialog('Tente novamente', 'Ops.. Ocorreu um erro ao excluir esta rota', 'error');

                    RouteController.delete(item.id).then(()=>{
                        SwalCustom.messageDialog('', 'Rota excluída com sucesso!', 'success').then(() => {
                            mountRoutes();
                        })
                    });
                });
            });

            elementProperty.addEventInElement('.btn-route-edit', 'onclick', function () {
                SwalCustom.dialogConfirm("Deseja ir para a tela de edição?", "", (status) => {
                    if(status){
                        preload(true);
                        id = this.id;
                        window.location.replace(`routeEdit/${id}`);
                    }
                });
            });

            elementProperty.addEventInElement(".user-corporate-route", "onclick", function () {
                const route = JSON.parse(window.atob(this.getAttribute("value")));
                updateListUsers(route.id);
            });

            elementProperty.addEventInElement(".show-detail-route", "onclick", function () {
                const route = JSON.parse(window.atob(this.getAttribute("value")));

                document.querySelector("#routeModalLabel").innerHTML = route.name;

                document.querySelector("#addressRoute").innerHTML = addItemAddressRoute(route.origin.tag, route.origin.address, route.origin.complement, 'list-group-item-success', 'EMBARQUE');
                document.querySelector("#addressRoute").innerHTML += route.route_way_points.map(item => {
                    return addItemAddressRoute(item.route_pit_stop.tag, item.route_pit_stop.address, item.route_pit_stop.complement, '', item.routePitStopType)
                }).join('');
                document.querySelector("#addressRoute").innerHTML += addItemAddressRoute(route.destination.tag, route.destination.address, route.destination.complement, 'list-group-item-info', 'DESEMBARQUE');

                document.querySelector("#listItemsRoute").innerHTML = route.route_trip_item_types.map(item => {
                    return `<li class="list-group-item d-flex align-items-center">
                                 <img src="${item.trip_item_type.picture}" class="mr-1" width="50" height="50">
                                 <p class="mb-0">${item.trip_item_type.name}</p>
                            </li>`
                }).join("");

                $('#showDetailRoute').modal('show')
            });

            elementProperty.addEventInElement('.change-status-route', 'onclick', function () {
                const route = JSON.parse(this.getAttribute("value"));

                if (route.active == true) {
                    return SwalCustom.dialogConfirm('Deseja desativar essa rota?', 'Você pode ativar a mesma posteriomente', status => {
                        if (status)
                            return changeStatus('disable');
                    });
                }

                return SwalCustom.dialogConfirm('Deseja ativar essa rota?', 'Você pode ativar a mesma posteriomente', status => {
                    if (status)
                        return changeStatus('enable');
                });

                function changeStatus(status) {
                    RouteController.releaseRoute(status, route.id).then(({status, response}) => {
                        if (!status)
                            return swal('Erro ao atualizar status', 'Entre em contato com o suporte', 'error');

                        swal('Status modificado com sucesso', '', 'success');
                        return mountRoutes();
                    });
                }
            });
        });
    }

    function updateListUsers(id) {
        preload(true);
        CorporateRouteController.companies(id).then(({response}) => {
            const element = document.querySelector("#listCompanies");
            if (response.length) {
                element.innerHTML = response.map(item => {
                    return `<li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <spa class="text-uppercase">${item.company.fantasyName}</spa>
                        <a href="#" class="remove-corporate-route" idCorporateRoute="${item.id}"><i class="material-icons">delete</i></a>
                    </div>
                 </li>`
                }).join("");
            } else {
                element.innerHTML = `<span class="text-center">Nenhuma empresa encontrada</span>`
            }
            $('#showUsersCorporateRoute').modal('show');

            elementProperty.addEventInElement("#btnAddCompany", "onclick", function () {
                companyId = null;
                $('#companyUser').val(null).trigger('change');
                $("#showAddUsersCorporateRoute").modal("show");
            });

            elementProperty.addEventInElement(".remove-corporate-route", "onclick", function (event) {
                event.preventDefault();
                const idCorporate = this.getAttribute("idCorporateRoute");
                SwalCustom.dialogConfirm("Deseja remover esse cliente da rota?", "", status => {
                    if (status) {
                        CorporateRouteController.delete(idCorporate).then(({status}) => {
                            if (status) {
                                updateListUsers(id);
                            }
                        })
                    }
                });
            });
        }).finally(() => {
            preload(false);
        });

        elementProperty.addEventInElement("#btnAddCorporateRoute", "onclick", function () {
            preload(true);
            CorporateRouteController.insert(id, companyId).then(({status, message, response}) => {
                SwalCustom.messageDialog(response && !status ? response[0] || "" : "", message, status ? "success" : "info").then(() => {
                    if (status) {
                        $("#showAddUsersCorporateRoute").modal("hide");
                        updateListUsers(id);
                    }
                })
            }).finally(() => {
                preload(false);
            });
        });

    }

    function addItemAddressRoute(tag, address, complement, type = '', typeStop = '') {
        return `<li class="list-group-item ${type}">
                        <div class="d-flex flex-column">
                            <small class="float-right text-right">${typeStop}</small>
                            <p class="mb-0">${tag}</p>
                            <small class="mb-0"><b>Endereço:</b> ${address}</small>
                            <small class="mb-0"><b>Ponto de referência:</b> ${complement}</small>
                        </div>
                    </li>`;
    }

    getEnterprises();

    function getEnterprises() {
        $('#companyUser').select2({
            placeholder: 'Busque por o nome fantasia',
            width: '100%',
            ajax: {
                url: environment.hosts.hostRequestNew + 'company?cityId=' + Session.getValueInSessionLocal("citySelected", "cityId"),
                headers: {
                    'token': Session.getValueInSession('user', 'api_token'),
                    'userid': Session.getValueInSession('user', 'idUser')
                },
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        'fantasyName': params.term,
                    };
                },
                processResults: function (result, params) {
                    params.page = params.page || 1;

                    return {
                        results: result.response.map(data => {
                            return {
                                id: data.id,
                                text: data.fantasyName,
                                phone: data.phone,
                                document: data.document
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
    }

    function formatSelecting(result) {
        if (result.loading) {
            return "Buscando...";
        }

        return `<div class="item-select2">
                    <div>
                        Nome: ${result.text}
                    </div>
                    <div>
                        Telefone:${result.phone}
                    </div>
                    <div>
                        CNPJ: ${result.document}
                    </div>
                </div>`;
    }

    function formatRepoSelection(result) {
        companyId = result.id;
        return result.text;
    }
});