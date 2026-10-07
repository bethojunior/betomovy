document.addEventListener("DOMContentLoaded", function () {
    listChargeTypes();
    preload(true);

    let timeoutSearch = null;
    let enterprise = {
        id: null,
    };

    const positionCity = getCenterPolygon(Session.getLocal("pointsCity"));

    CompanyController.getAllCompanyDeliveryConfig().then(({response}) => {
        document.querySelector("#listCompanyDelivery").innerHTML = response.map(item => {
            return `<tr>
                        <td><img src="${item.picture}" width="50" height="50" /></td>
                        <td>${item.company.fantasyName}</td>
                        <td>${item.company.document}</td>
                        <td>${item.releaseDelivery == true ? "Ativo" : "Desabilitado"}</td>
                        <td>${item.releaseMenu == true ? "Ativo" : "Desabilitado"}</td>
                        <td><a href="#" value='${btoa(JSON.stringify(item))}' class="list-local-company">Locais</a> </td>
                        <td><a href="#" value='${btoa(JSON.stringify(item))}' class="edit-company-delivery">Editar</a> </td>
                    </tr>`
        }).join("");

        elementProperty.addEventInElement(".list-local-company", "onclick", function () {
            $("#listLocalCompanyModal").modal('show');

            const company = JSON.parse(atob(this.getAttribute("value")));
            updateList(company.companyId);

            function updateList(id) {
                CompanyController.getCompanyAddress(company.companyId).then(({response}) => {
                    document.querySelector("#listAddressCompanyDelivery").innerHTML = response.map(item => {
                        return `<li class="list-group-item select-local-default ${item.isDefault ? "active" : ""}" style="cursor: pointer"  value="${item.id}">
                            <div class="row">
                                <div class="col-10">${item.address}</div>
                                <div class="col-2">
                                    <a href="#" class="remove-address-company" value="${item.id}"  style="display: ${item.isDefault ? "none" : "block"}">
                                        <span aria-hidden="true">&times;</span>
                                    </a>
                                </div>
                            </div>
                        </li>`
                    }).join("");

                    elementProperty.addEventInElement(".select-local-default", "onclick", function () {
                        if (this.classList.contains("active"))
                            return;
                        SwalCustom.dialogConfirm("Selecionar como principal?", "", status => {
                            if (status) {
                                CompanyController.setDefaultPlace(this.getAttribute("value")).then(({status, message}) => {
                                    SwalCustom.messageDialog("", message, status ? "success" : "info");
                                    updateList(company.companyId)
                                }).finally(() => preload(false))
                            }
                        })
                    });

                    elementProperty.addEventInElement(".remove-address-company", "onclick", function (event) {
                        event.stopPropagation();
                        SwalCustom.dialogConfirm("Deseja remover local?", "", status => {
                            if (status) {
                                CompanyController.removeCompanyAddress(this.getAttribute("value")).then(({status, message}) => {
                                    SwalCustom.messageDialog("", message, status ? "success" : "info");
                                    updateList(company.companyId)
                                }).finally(() => preload(false))
                            }
                        })
                    });
                });
            }


            elementProperty.addEventInElement("#btnAddLocalCompanyDelivery", "onclick", function () {
                const element = document.querySelector(".select-address-delivery.active");
                if (!element)
                    return alert("Selecione um local");

                const object = JSON.parse(element.getAttribute("value"));
                preload(true);
                SettingsController.getLocationByAddress(object.address).then(({data}) => {
                    const object = {
                        "address": data.address,
                        "latitude": data.latitude,
                        "longitude": data.longitude,
                        "companyId": company.companyId,
                        "isDefault": document.querySelector("#checkDefaultLocal").checked
                    };

                    CompanyController.companyAddress(object).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info");
                        updateList(company.companyId)
                        if (status)
                            $("#addLocalCompanyModal").modal('hide');
                    }).finally(() => preload(false))
                })
            });

        });

        elementProperty.addEventInElement(".edit-company-delivery", "onclick", function () {
            const item = JSON.parse(atob(this.getAttribute("value")));

            document.querySelector("#nameCompanyEdit").innerHTML = `<b>Nome fantasia: </b>${item.company.fantasyName}`;
            document.querySelector("#documentCompanyEdit").innerHTML = `<b>CNPJ: </b>${item.company.document}`;
            document.querySelector("#releaseMenuCheckEdit").checked = item.releaseMenu == true;
            document.querySelector("#releaseDeliveryCheckEdit").checked = item.releaseDelivery == true;
            document.querySelector("#insertLogoEdit").style.backgroundImage = `url(${item.picture})`;
            document.querySelector("#selectChargeTypeEdit").value = item.company.establishmentCollectionManagementId === null ? 0 : item.company.establishmentCollectionManagementId;

            $("#editCompanyModal").modal('show');

            elementProperty.addEventInElement("#btnEditCompanyDelivery", "onclick", function () {
                preload(true);
                const formData = new FormData();
                formData.append("releaseMenu", document.querySelector("#releaseMenuCheckEdit").checked ? "1" : "0");
                formData.append("releaseDelivery", document.querySelector("#releaseDeliveryCheckEdit").checked ? "1" : "0");
                formData.append('establishmentCollectionManagementId', document.querySelector("#selectChargeTypeEdit").value);

                if (document.querySelector("#pictureCompanyEdit").files[0]) {
                    return ImageUpload.resize(document.querySelector("#pictureCompanyEdit").files[0], 250, 250).then(file => {
                        formData.append("picture", file.data, file.name);
                        CompanyController.updateCompanyDeliveryConfig(item.company.id, formData).then(({status, message}) => {
                            preload(false);
                            SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                                if (status) location.reload();
                            })
                        })
                    })
                }

                CompanyController.updateCompanyDeliveryConfig(item.company.id, formData).then(({status, message}) => {
                    preload(false);
                    SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                        if (status) location.reload();
                    })
                })
            });
        });

    }).finally(() => preload(false));

    getEnterprises();

    function getEnterprises() {
        $('#getEnterprisesByDelivery').select2({
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
        enterprise.id = result.id;
        return result.text;
    }

    elementProperty.addEventInElement("#btnAddCompanyDelivery", "onclick", function () {
        const formData = new FormData();

        const data = {
            "companyId": enterprise.id,
            "releaseMenu": document.querySelector("#releaseMenuCheck").checked,
            "releaseDelivery": document.querySelector("#releaseDeliveryCheck").checked,
            "establishmentCollectionManagementId": document.querySelector("#selectChargeType").value
        };

        if (data.companyId == null || data.companyId == '')
            return alert("Informe o estabelecimento");

        if (document.querySelector("#pictureCompany").files.length === 0)
            return alert("Selecione a logo");

        ImageUpload.resize(document.querySelector("#pictureCompany").files[0], 250, 250).then((file) => {
            formData.append("companyId", enterprise.id);
            formData.append("releaseMenu", document.querySelector("#releaseMenuCheck").checked ? "1" : "0");
            formData.append("releaseDelivery", document.querySelector("#releaseDeliveryCheck").checked ? "1" : "0");
            formData.append('establishmentCollectionManagementId', document.querySelector("#selectChargeType").value);
            formData.append("picture", file.data, file.name);

            preload(true);

            CompanyController.insertCompanyDeliveryConfig(formData).then(({message, status, response}) => {
                preload(false);
                SwalCustom.messageDialog(status ? "" : response[0], message, status ? "success" : "info").then(() => {
                    if (status) location.reload()
                });
            });
        })
    });

    elementProperty.addEventInElement("#pictureCompany", "onchange", function () {
        const input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                document.querySelector("#insertLogo").style.backgroundImage = `url('${e.target.result}')`
            };

            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    });
    elementProperty.addEventInElement("#pictureCompanyEdit", "onchange", function () {
        const input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                document.querySelector("#insertLogoEdit").style.backgroundImage = `url('${e.target.result}')`
            };

            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    });

    elementProperty.addEventInElement("#searchPlaceCompany", "oninput", function () {
        clearTimeout(timeoutSearch);

        timeoutSearch = setTimeout(() => {
            SettingsController.getPlaces(this.value, positionCity).then(({status, data}) => {

                document.querySelector("#listSearchInputCompany").innerHTML = data.map(item => {
                    return `<li class="list-group-item select-address-delivery" style="cursor: pointer" value='${JSON.stringify(item)}'>${item.address}</li>`;
                }).join("");

                elementProperty.addEventInElement(".select-address-delivery", "onclick", function () {
                    elementProperty.removeClass(".select-address-delivery", "active");
                    this.classList.add("active");

                    const object = JSON.parse(this.getAttribute("value"));

                    document.querySelector("#searchPlaceCompany").value = object.address;
                })
            });
        }, 1000);


    });

    function getCenterPolygon(arr) {
        var minX, maxX, minY, maxY;
        for (var i = 0; i < arr.length; i++) {
            var x = arr[i].lat, y = arr[i].lng;
            minX = (x < minX || minX == null) ? x : minX;
            maxX = (x > maxX || maxX == null) ? x : maxX;
            minY = (y < minY || minY == null) ? y : minY;
            maxY = (y > maxY || maxY == null) ? y : maxY;
        }
        return {lat: (minX + maxX) / 2, lng: (minY + maxY) / 2};
    }

    function listChargeTypes() {
        preload(true);
        CompanyController.getAllEstablishmentCharge().then(({response}) => {
            const charges = response.map(item => {
                return `
                    <option value="${item.id}">${item.label}</option>
                `;
            }).join('');

            document.querySelector('#selectChargeType').innerHTML += charges;
            document.querySelector('#selectChargeTypeEdit').innerHTML += charges;
        });
        preload(false);
    }
});