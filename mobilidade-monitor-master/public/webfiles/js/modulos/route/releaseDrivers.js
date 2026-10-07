let pathImage = environment.hosts.hostImageDriver;
init();

function init() {
    elementProperty.getElement("#mount-list-drivers-route", these => {
        RouteController.listReleaseDriverRoute().then(({status, response}) => {
            if (!status)
                return swal(
                    "Erro ao listar solicitações dos motoristas",
                    "Contate o suporte",
                    "error"
                );

            let content = "";
            content += response.map(item => {
                return `
                    <tr>
                        <td>${item.driver.name}</td>
                        <td>${item.driver.phone}</td>
                        <td>${new Date(item.created_at).toLocaleString()}</td>
                        <td>${item.route.name}</td>
                        <td>${ item.active == false
                                    ? `<input id="${item.id}" type="button" class="form-control btn btn-primary btn-enable-driver-route" value="Liberar">`
                                    : `<input id="${item.id}" type="button" class="form-control btn btn-warning btn-disabled-driver-route" value="Bloquear">`
                            }
                        </td>
                    </tr>
                `
            }).join("");
            these.innerHTML = content;

            elementProperty.addEventInElement(
                ".btn-enable-driver-route",
                "onclick",
                function () {
                    RouteController.enableDriverInRoute(this.getAttribute("id")).then(
                        ({status, message}) => {
                            if (!status) return SwalCustom.messageDialog("", message);

                            SwalCustom.messageDialog(
                                "",
                                "Motorista liberado",
                                undefined,
                                "success"
                            );
                            init();
                        }
                    );
                }
            );

            elementProperty.addEventInElement(
                ".btn-disabled-driver-route",
                "onclick",
                function () {
                    RouteController.disableDriverInRoute(this.getAttribute("id")).then(
                        ({status, message}) => {
                            if (!status) return SwalCustom.messageDialog("", message);

                            SwalCustom.messageDialog(
                                "",
                                "Motorista não liberado",
                                undefined,
                                "success"
                            );
                            init();
                        }
                    );
                }
            );
        });
    });
}
