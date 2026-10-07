document.addEventListener("DOMContentLoaded", function () {
    preload(true);

    const positionCity = getCenterPolygon(Session.getLocal("pointsCity"));

    const central = {
        "name": "",
        "address": "",
        "latitude": null,
        "longitude": null,
    };

    CentralController.centralCallDriver().then(({response}) => {
        document.querySelector("#centralCallDriver").innerHTML += Object.keys(response).map((attribute) => {
            return `<option value="${attribute}">${response[attribute]}</option>`
        }).join("");
    });

    const splitUrl = location.href.split("/");

    const idCentral = parseInt(splitUrl[splitUrl.length - 1]);

    CentralController.getCentral(idCentral).then(({status, response: data}) => {
        elementProperty.getElement(`#previewImageCentral`,
            element => {
                element.setAttribute("src", data.logo);
            });


        document.getElementById("nameCentral").value = data.name;
        document.getElementById("addressCentral").value = data.address;
        document.getElementById("centralCallDriver").value = data.centralCallDriver;
        document.getElementById("syncCustomers").checked = data.syncCustomers == true;
        document.querySelector(`*[name='showAllPrices'][value='${data.showAllPrices}']`).checked = true;


        central.latitude = data.latitude;
        central.longitude = data.longitude;
        central.address = data.address;

        preload(false)
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
                    SettingsController.getLocationByAddress(central.address).then(({data})=>{
                        document.querySelector("#addressCentral").value = central.address;
                        central.latitude = data.latitude;
                        central.longitude = data.longitude;
                        $('#staticBackdrop').modal('hide')
                    }).finally(()=> preload(false));

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
                this.disabled = true;
                CentralController.updateLogo(idCentral, result).then(({errors, message, status}) => {
                    if (!status) {
                        SwalCustom.messageDialog(errors[0], message, "info");
                        return;
                    }
                    SwalCustom.messageDialog("", message, "success");
                }).finally(() => {
                    this.disabled = false;
                })
            }).catch(err => {
            });

            reader.readAsDataURL(file);
        }
    });

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
        console.log(result);

        central.responsibleId = result.id;
        return result.text;
    }

    elementProperty.addEventInElement("#btnSaveCentral", "onclick", function () {
        central.name = document.getElementById("nameCentral").value;
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

        this.disabled = true;
        preload(true);

        CentralController.edit(idCentral, central).then(({message, errors, status}) => {
            if (!status) {
                SwalCustom.messageDialog(errors[0], message, "info");
                return;
            }

            SwalCustom.messageDialog("", message, "success").then(() => {
                location.href = environment.hosts.local + 'central/';
            })
        }).finally(() => {
            this.disabled = false;
            preload(false);
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