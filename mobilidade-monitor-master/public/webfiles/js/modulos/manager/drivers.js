document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    const userLogged = Session.get('user');
    const managerVerificationResult = ManagerController.verifyUserIsManager(userLogged.idUser);

    const manager = {
        idUser: "",
        page: ""
    };

    // Check if userLogged.roleId is different from 1, 2, or 3
    const isUserRoleValid = ![1, 2, 3].includes(userLogged.roleId);

    if (isUserRoleValid && managerVerificationResult) {
        $('#selectManager').append(
            '<option value="' + userLogged.id + '" selected="selected">' + userLogged.name + '</option>'
        );
        $('#selectManager').attr('disabled', 'disabled');
        showListDrivers(userLogged.idUser, 1);
    } else {
        $('#selectManager').select2({
            placeholder: 'Selecione o gestor',
            width: '100%',
            ajax: {
                url: environment.hosts.hostRequest + "manager",
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
                        results: result.response.map(data => {
                            return {
                                id: data.userId,
                                text: data.user.name,
                                email: data.user.email,
                                phone: data.user.phone
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
                        ${result.text}
                    </div>
                    <div>
                        ${result.email}
                    </div>
                    <div>
                        ${result.phone}
                    </div>
                </div>`;
    }

    function formatRepoSelection(result) {
        showListDrivers(result.id, 1)
        return result.text;
    }

    function showListDrivers(idUser, page, concat = false) {
        manager.idUser = idUser;
        manager.page = page;
        elementProperty.getElement("#listDrivers", element => {
            if (idUser.length === 0) {
                element.innerHTML = "";
                return;
            }

            preload(true);
            ManagerController.drivers(idUser, manager.page).then(({status, response}) => {
                if (response.length === 0) {
                    element.innerHTML = "<h5 class='alert text-center'>Nenhum motorista cadastrado</h5>";
                    preload(false);
                    return;
                }

                preload(false);
                const list = response.map(driver => {
                    document.getElementById('totalDrivers').innerHTML = response.length;
                    return `<li  class="list-group-item">
                                <div class="row">
                                    <div class="col-6 col-md-4">${driver.indicated_name}</div>
                                    <div class="col-6 col-md-3">${driver.indicated_phone}</div>
                                    <div class="col-6 col-md-3">${driver.cityName}</div>         
                                </div>
                            </li>`;
                }).join("");

                element.innerHTML = concat ? element.innerHTML + list : list;

                // if (data.showEndButton) {
                //     element.innerHTML += `<li class="list-group-item show-more">
                //             <a href="#"  style="display: block;text-align: center">Mostrar mais</a>
                //            </li>`;
                // }

                // elementProperty.getElement("#totalDrivers",element=>{
                //     element.innerHTML = data.totalRows;
                // });

                elementProperty.addEventInElement(".show-more", "onclick", function () {
                    this.remove();
                    showListDrivers(manager.idUser, manager.page + 1, true);
                });
            });
        })

    }
});