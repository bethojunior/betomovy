document.addEventListener("DOMContentLoaded", function () {
    loadList();

    function loadList() {
        preload(true);
        AddressBlacklistController.get().then(({response}) => {
            document.querySelector("#listAddress").innerHTML = response.map((data) => {
                return `<tr>
                        <td><a href="https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}" target="_blank">${data.address}</a></td>
                        <td>${new Date(data.created_at).toLocaleString()}</td>
                        <td>${data.approved == true ? "Bloqueado" : "Desbloqueado"}</td>
                        <td>
                        ${ data.approved == false ? 
                            `<span class="material-icons cursor-pointer accept-address" value="${data.id}">check_circle</span>` :
                            `<span class="material-icons cursor-pointer refuse-address" value="${data.id}">close</span>`

                }
                        </td>
                        <td>
                            <span class="material-icons cursor-pointer delete-address" value="${data.id}">
                                delete
                           </span
                        </td>
                    </tr>`
            }).join("");

            elementProperty.addEventInElement(".refuse-address", "onclick", function () {
                const value = this.getAttribute("value");
                SwalCustom.dialogConfirm("Deseja desbloquear endereço?", "", (status) => {
                    if (!status)
                        return;
                    preload(true);
                    AddressBlacklistController.refuse(value).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            loadList();
                        })
                    }).finally(() => {
                        preload(false)
                    });
                });
            });

            elementProperty.addEventInElement(".accept-address", "onclick", function () {
                const value = this.getAttribute("value");
                SwalCustom.dialogConfirm("Deseja bloquear endereço?", "", (status) => {
                    if (!status)
                        return;
                    preload(true);
                    AddressBlacklistController.approve(value).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            loadList();
                        })
                    }).finally(() => {
                        preload(false)
                    });
                });
            });
            elementProperty.addEventInElement(".delete-address", "onclick", function () {
                const value = this.getAttribute("value");
                SwalCustom.dialogConfirm("Deseja excluir endereço?", "", (status) => {
                    if (!status)
                        return;
                    preload(true);
                    AddressBlacklistController.delete(value).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            loadList();
                        })
                    }).finally(() => {
                        preload(false)
                    });
                });
            });
        }).finally(() => {
            preload(false);
        });
    }
});