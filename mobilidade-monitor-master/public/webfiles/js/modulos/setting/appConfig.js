document.addEventListener("DOMContentLoaded", () => {
    list();

    elementProperty.getElement(".logo-monitor", (these) => {
        these.style.backgroundImage = `url(${environment.hosts.hostImageDefault})`;
        these.style.backgroundPosition = "center";
        these.style.backgroundRepeat = "no-repeat";
        these.style.backgroundSize = "contain";
    });

    const btnUpdateSave = document.querySelector("#btn-update-save");
    btnUpdateSave.addEventListener("click", () => {
        const formData = new FormData();
        const logoElValue = document.querySelector("#siteLogo")?.files;

        if (!logoElValue.length) {
            return SwalCustom.dialogConfirm("Por favor selecione uma logo"); 
        }

        formData.append("logo", logoElValue[0]);
            SwalCustom.dialogConfirm("Deseja definir a logo padrão?", "", (status) => {
                if (status) {
                    preload(true);
                    AppConfigController.updateDefaultLogo(formData).then(() => {
                        preload(false);
                        SwalCustom.messageDialog("", "Logo padrão definido com sucesso", "success").then(() => {
                            window.location.reload();
                        })
                        const el = document.querySelector(".logo-monitor");
                        el.style.backgroundImage = `url(${environment.hosts.hostImageDefault})`;
                        el.style.backgroundPosition = "center";
                        el.style.backgroundRepeat = "no-repeat";
                        el.style.backgroundSize = "contain";
                    });
                }
            });
    })

    elementProperty.addEventInElement("#addAppConfigModal", "onsubmit", event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", document.querySelector("#name").value);
        formData.append("mainColor", document.querySelector("#mainColor").value);
        formData.append("mainColorText", document.querySelector("#mainColorText").value);
        formData.append("secondaryColor", document.querySelector("#secondaryColor").value);
        formData.append("secondaryColorText", document.querySelector("#secondaryColorText").value);
        formData.append("appId", document.querySelector("#appId").value);
        formData.append("logo", document.querySelector("#logo").files[0]);

        preload(true);
        AppConfigController.create(formData).then(() => {
            $("#addAppConfigModal").modal("hide");
            preload(false);
            list();
        })

    });

    function list() {
        preload(true);
        AppConfigController.list().then(({response}) => {
            preload(false);
            console.log(response);

            document.querySelector("#list").innerHTML = response.map(item => `<tr>
                    <td>${item.name}</td>
                    <td>${getTypeByApp(item.appId)}</td>
                    <td>
                        <input type="color" disabled value="${item.mainColor}" />
                    </td>
                    <td>
                        <input type="color" disabled value="${item.mainColorText}" />
                    </td>
                    <td>
                        <input type="color" disabled value="${item.secondaryColor}" />
                    </td>
                    <td style="display: none">
                        <input type="color" disabled value="${item.secondaryColorText}" />
                    </td>
                    <td>
                    <a class="delete-app-config" value="${item.id}" href="#">Excluir</a>
                    </td>
                </tr>`).join("");

            elementProperty.addEventInElement(".delete-app-config", "onclick", function() {
                event.preventDefault();

                SwalCustom.dialogConfirm("Deseja excluir essa configuração?", "", (status) => {
                    if (status) {
                        preload(true);
                        AppConfigController.delete(this.getAttribute("value")).then(() => {
                            preload(false);
                            list();
                        })
                    }
                });
            })
        })
    }

    function getTypeByApp(appId) {
        switch (appId) {
            case 2:
                return "APP MOTORISTA MOBILIDADE";
            case 4:
                return "APP CLIENTE MOBILIDADE"
            default:
                return "INDEFINIDO";
        }
    }
})
