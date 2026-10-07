document.addEventListener("DOMContentLoaded", () => {

    let timeout = null;

    NotificationController.adminNotificationType().then(({response}) => {
        document.querySelector("#filterNotificationView").innerHTML += response.map(item => {
            return `<option value="${item.id}">${item.name}</option>`;
        }).join("")
    });

    getNotification(1);

    function getNotification(page, filter = null) {
        clearTimeout(timeout);
        preload(true);
        NotificationController.getNotificationBy({page, adminNotificationTypeId: filter}).then(({response}) => {
            const {data, current_page, last_page} = response;
            document.querySelector("#listNotification").innerHTML = data.map(item => {
                return `<tr ${item.read == true ? "style='opacity:0.75'" : ""}>
                        <td style="max-width: 300px;">${item.message}</td>
                        <td>${new Date(item.created_at).toLocaleString()}</td>
                        <td><a ${item.driver ? `href="/Driver/edit/${item.driver.idDriver}"` : ""} target="_blank">${item.driver ? `Motorista ` : ""}${item.user ? item.user.name : ""}</a></td>
                        <td><a href="https://wa.me/55${item.user.phone != null && item.user.phone.replace(/[^0-9.]/g, "")}" target="_blank">${ item.user.phone != null ? item.user.phone : "Não Informado"}</a></td>
                        <td>${item.read == false ? `<button type="button" class="btn btn-primary btn-view-notification" idNotification="${item.id}">Marcar</button>` : ""}</td>
                    </tr>`
            }).join("");

            if (current_page === 1) {
                elementProperty.addClass(".page-back", "disabled");
            } else {
                elementProperty.removeClass(".page-back", "disabled");
            }

            if (current_page === last_page) {
                elementProperty.addClass(".page-next", "disabled");
            } else {
                elementProperty.removeClass(".page-next", "disabled");
            }

            elementProperty.addEventInElement(".page-next", "onclick", () => {
                const next_page = current_page + 1;
                if (next_page <= last_page) {
                    getNotification(next_page, filter)
                }
            });
            elementProperty.addEventInElement(".page-back", "onclick", () => {
                const prev_page = current_page - 1;
                if (prev_page > 0) {
                    getNotification(prev_page, filter)
                }
            });

            elementProperty.addEventInElement(".btn-view-notification", "onclick", function () {
                const idNotification = this.getAttribute("idNotification");

                SwalCustom.dialogConfirm("Confirma marcação de leitura", "", (status) => {
                    if (status) {
                        preload(true);
                        NotificationController.notificationView(idNotification).then(() => {
                            getNotification(page, filter);
                        })
                    }
                })
            });

            timeout = setTimeout(() => getNotification(page, filter), 60000);
        }).finally(() => {
            preload(false);
        });
    }

    elementProperty.addEventInElement("#btnFilterView", "onclick", () => {
        const value = document.querySelector("#filterNotificationView").value;

        getNotification(1, value === "" ? null : value);
    })
});