document.addEventListener("DOMContentLoaded", function () {

    preload(true);

    function getID() {
        let arrayUrl = location.href.split("/");
        return arrayUrl[arrayUrl.length - 1]
    }

    function fillPermissionsSelected(permissions) {
        permissions.map(item => {
            item.user_group_permissions.map(permission => {
                const element = document.querySelector(`#permission_${permission.userGroupId}_${permission.id}`);
                if (element && permission.statusId == 1)
                    element.checked = true;
            });
        })
    }

    function showCities(cities) {
        document.querySelector("#listCityRules").innerHTML = cities.map(city => {
            return `<li class="list-group-item">
                            <div class="form-group form-check m-0">
                                ${city.shortName || city.nome}
                                <i class="material-icons float-right remove-city-role" 
                                    style="cursor: pointer" value="${city.id}">close</i>
                            </div>
                        </li>`;
        }).join("");

        elementProperty.addEventInElement(".remove-city-role", "onclick", function () {
            SwalCustom.dialogConfirm("", "Deseja remover essa cidade?", (status) => {
                if (!status)
                    return;
                preload(true);
                RulesController.removeCity(getID(), this.getAttribute("value"))
                    .then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info");
                        getDataRole();
                    })
                    .finally(() => {
                        preload(false);
                    })
            });
        });
    }


    CityController.getActives().then(({data}) => {
        document.querySelector("#selectCity").innerHTML = data.map(item => {
            return `<option value="${item.cityId}">${item.shortName || item.nome}</option>`;
        }).join("")
    }).finally(() => {
        preload(false);
    });

    elementProperty.addEventInElement("#btnAddCity", "onclick", function () {
        preload(true);
        RulesController.addCity(getID(), document.querySelector("#selectCity").value).then(({status, message}) => {
            if (status)
                getDataRole();

            SwalCustom.messageDialog("", message, status ? "success" : "info");
        }).finally(() => {
            preload(false);
        });
    });


    RulesController.actionPermissions().then(({response}) => {
        document.querySelector("#listOptionRules").innerHTML = response.map(item => {
            return `<li class="list-group-item active">${item.name}</li>
                ${item.user_group_permissions.map(permission => {
                return `  <li class="list-group-item">
                                    <div class="form-group form-check m-0">
                                        <input type="checkbox" class="form-check-input input-check-permission" 
                                            id="permission_${permission.userGroupId}_${permission.id}"
                                             value="${permission.id}">
                                        <label class="form-check-label" 
                                        for="permission_${permission.userGroupId}_${permission.id}">
                                            ${permission.description}</label>
                                    </div>
                                </li>
                     `;
            }).join("")}
            `
        }).join("");

        getDataRole();
    });

    function getDataRole() {
        RulesController.get(getID()).then(async ({response}) => {
            document.querySelector("#nameRule").value = response.name;
            document.querySelector("#isSupport").checked = response.support == true;
            fillPermissionsSelected(response.permissions);
            showCities(response.cities)

            const outputData = [];
            response.permissions.forEach(permission => {
                // Cria uma lista vazia para armazenar as permissões de grupo de usuário com statusId = 1
                const groupPermissions = [];
                permission.user_group_permissions.forEach(userGroupPermission => {
                    if (userGroupPermission.statusId === 1) {
                        // Adiciona a permissão de grupo de usuário à lista de permissões de grupo de usuário
                        groupPermissions.push(userGroupPermission.name);
                    }
                });
                // Se houver permissões de grupo de usuário com statusId = 1, adiciona um novo objeto ao outputData
                if (groupPermissions.length > 0) {
                    outputData.push({
                        name: permission.name,
                        permissions: groupPermissions
                    });
                }
            });
            Session.set('roles', {
                cities: [],
                groups: outputData,
                name: response.name,
            });
        }).finally(() => {
            preload(false);
        });
    }

    elementProperty.addEventInElement("#btnSaveRule", "onclick", () => {
        const permissions = elementProperty.getElements(".input-check-permission").filter(element => element.checked).map(element => element.value);

        const elementName = document.querySelector("#nameRule");

        if (elementName.value.length === 0) {
            alert("Informe a descrição da regra");
            return elementName.focus();
        }
        if (permissions.length === 0)
            return alert("Selecione pelo menos uma permissão");

        preload(true);
        RulesController.editRole(getID(),elementName.value, permissions, document.querySelector("#isSupport").checked).then((result) => {
            getDataRole()
            sessionClear()
            SwalCustom.messageDialog("", result.message, "success");
        }).finally(() => {
            preload(false);
        });
    });

    // Função para limpar a sessão
    function sessionClear() {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

    }

});