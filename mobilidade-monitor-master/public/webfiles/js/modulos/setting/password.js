document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        stopNotificationMonitor = true;
    }, 2000);

    elementProperty.addEventInElement("#btnUpdatePassword", "onclick", function () {
        const passwordCurrent = document.querySelector("#passwordCurrent").value;
        const newPassword = document.querySelector("#newPassword").value;
        const againPassword = document.querySelector("#againPassword").value;

        if (newPassword.length < 6) {
            return alert("A nova senha deve conter no minimo 6 caracteres");
        }

        if (newPassword !== againPassword)
            return alert("Senha de confirmação não confere com a nova senha");

        const localization = localStorage.getItem("@monitor_legado:localization")

        preload(true);
        UserController.getAuthenticate({
            email: Session.get("user").email, password: passwordCurrent, localization: JSON.parse(localization)
        }).then(result => {
            if (!result.status) {
                preload(false);
                SwalCustom.messageDialog("", "Senha atual está incorreta", "info");
                return;
            }

            Session.set("user", {
                ...Session.get("user"),
                api_token: result.response.api_token
            });

            preload(true);
            UserController.updatePasswordByConfig(Session.get("user").idUser, {password: newPassword, updatePasswordByConfig: true}).then(({status, response}) => {
                if (!status) {
                    preload(false);
                    return SwalCustom.messageDialog(response[0],"", "error");
                }

                SwalCustom.messageDialog("", "Senha atualizada com sucesso", "success").then(() => location.reload());
            }).finally(() => {
                preload(false);
            })
        });
    });
});