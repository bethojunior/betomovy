document.addEventListener("DOMContentLoaded", function () {
    elementProperty.addEventInElement("#btnAddressSearch", "onclick", function () {
        getList(document.querySelector("#textSearch").value);

    });

    function getList(query) {
        preload(true);
        AddressController.cacheAddress(query).then(({response}) => {
            document.querySelector(".table").style = "";
            document.querySelector(`#list`).innerHTML = response.map(item => {
                return `<tr>
                            <td>${item.address}</td>
                            <td><a href="http://maps.google.com/?q=${item.latitude},${item.longitude}" target="_blank">Ver posição</a></td>
                            <td>
                                <button type="button" item='${btoa(JSON.stringify(item))}' class="btn btn-danger remove-item"><i class="material-icons">delete</i></button>
                            </td>
                        </tr>`
            }).join("");
            elementProperty.addEventInElement(".remove-item", "onclick", function () {
                const {address, latitude, longitude} = JSON.parse(atob(this.getAttribute("item")));

                SwalCustom.dialogConfirm("Deseja bloquear esse endereço", "", (status) => {
                    if (status) {
                        preload(true);
                        AddressBlacklistController.insert({address, latitude, longitude}).then(() => {
                            preload(false);
                            getList(query);
                        })
                    }
                });
            });
        }).finally(() => {
            preload(false);
        })
    }
});