document.addEventListener("DOMContentLoaded", function () {
    Mask.setMaskPhone("#phoneUserCentral");

    const positionCity = getCenterPolygon(Session.getLocal("pointsCity"));

    const central = {
        "name": "",
        "address": "",
        "latitude": null,
        "longitude": null,
        "responsibleId": null,
        "logo": null,
        syncCustomers: false,
        user: {
            name: "",
            email: "",
            phone: "",
            password: ""
        }
    };

    CentralController.centralCallDriver().then(({response}) => {
        document.querySelector("#centralCallDriver").innerHTML += Object.keys(response).map((attribute) => {
            return `<option value="${attribute}">${response[attribute]}</option>`
        }).join("");
    });

    let timeSearch = null;

    elementProperty.addEventInElement("#addressCentralSearch", "oninput", function () {
        clearTimeout(timeSearch);

        timeSearch = setTimeout(() => {
            SettingsController.getPlaces(this.value, positionCity).then(result => {
                document.querySelector("#listAddress").innerHTML = result.data.map(item => {
                    return `<li style="cursor: pointer" class="list-group-item select-local-central" value='${JSON.stringify(item)}'>${item.address}</li>`;
                }).join("");

                elementProperty.addEventInElement(".select-local-central", "onclick", function () {
                    const place = JSON.parse(this.getAttribute('value'));
                    central.address = place.address;
                    preload(true);
                    SettingsController.getLocationByAddress(central.address).then(({data}) => {
                        document.querySelector("#addressCentral").value = central.address;
                        central.latitude = data.latitude;
                        central.longitude = data.longitude;
                        $('#staticBackdrop').modal('hide')
                    }).finally(() => preload(false));

                });
            })
        }, 1000);
    });

    elementProperty.addEventInElement("#inputPreviewImageCentral", "onchange", function () {
        const input = this;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                elementProperty.getElement(`#previewImageCentral`,
                    element => {
                        element.setAttribute("src", e.target.result);
                    });
            };

            const file = input.files[0];

            ImageUpload.resize(file, 280, 150).then(result => {
                console.log(result);
                central.logo = result;
            }).catch(err => {
                console.log(err);
            });

            reader.readAsDataURL(file);
        }
    });

    elementProperty.addEventInElement("#register-international", "onchange", () => {
        const isChecked = document.getElementById("register-international")?.checked;
        if (isChecked) {
            Mask.removeMask("#phoneUserCentral");
        } else {
            Mask.setMaskPhone("#phoneUserCentral");
        }
    })

    elementProperty.addEventInElement("#btnSaveCentral", "onclick", function () {
        central.name = document.getElementById("nameCentral").value;
        central.user.name = document.getElementById("nameUserCentral").value;
        central.user.email = document.getElementById("emailUserCentral").value;
        central.user.phone = document.getElementById("phoneUserCentral").value;
        central.user.password = document.getElementById("passwordUserCentral").value;
        central.syncCustomers = document.getElementById("syncCustomers").checked;
        central.centralCallDriver = document.getElementById("centralCallDriver").value;
        central.showAllPrices = document.querySelector("*[name='showAllPrices']:checked").value == true;

        if (central.name.length === 0) {
            SwalCustom.messageDialog("Informe o nome da central", "Atenção", "info");
            return;
        }
        if (central.address.length === 0) {
            SwalCustom.messageDialog("Informe o endereço da central", "Atenção", "info");
            return;
        }

        if (central.latitude == null && central.longitude == null) {
            SwalCustom.messageDialog("Informe o endereço da central", "Atenção", "info");
            return;
        }

        if (central.logo == null) {
            SwalCustom.messageDialog("Logo não selecionada", "Atenção", "info");
            return;
        }

        if (central.centralCallDriver === "")
            return SwalCustom.messageDialog("", "Selecione a forma de chamado de motorista", "info");

        if (central.user.name.length === 0)
            return SwalCustom.messageDialog("", "Informe o nome do responsavel", "info");

        if (!ValidateForm.validateEmail(central.user.email))
            return SwalCustom.messageDialog("", "E-mail está inválido", "info");

        const isChecked = document.getElementById("register-international")?.checked;

        if (!ValidateForm.validatePhone(central.user.phone) && !isChecked)
            return SwalCustom.messageDialog("", "Número de telefone inválido", "info");

        if (central.user.password.length < 5)
            return SwalCustom.messageDialog("", "Senha deve conter pelo menos 6 digitos", "info");

        this.disabled = true;

        preload(true);

        CentralController.insert(central).then(({message, response, status}) => {
            if (!status) {
                SwalCustom.messageDialog(response.join(""), message, "info");
                return;
            }

            SwalCustom.messageDialog("", message, "success").then(() => {
                location.href = environment.hosts.local + 'central/';
            })
        }).finally(() => {
            this.disabled = false;
            preload(false)
        });
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
});