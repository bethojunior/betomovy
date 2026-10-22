document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#addDriverInCentral", "onclick", function () {
        addDriverCentral(false, this);
    });

    elementProperty.addEventInElement("#addDriver", "onclick", function () {
        const favEl = document.getElementById('favoriteCheckBox');
        const isFavorite = favEl ? favEl.checked : false;
        addDriverCentral(isFavorite, this);
    });

    function addDriverCentral(isFavorite = false, btn = null) {
        const inputEl = document.getElementById("inputCodeDriver");
        const code = (inputEl ? inputEl.value : "").toUpperCase().trim();

        if (!validateCode(code)) {
            SwalCustom.messageDialog("", "Código inválido. Formato esperado: ex. AB12345C", undefined, "warning");
            return;
        }

        const idDriver = parseInt(code.replace(/[^0-9]/g, ""));
        const idCentral = Session.getValueInSession("centralSelected", "id");

        if (!idCentral) {
            SwalCustom.messageDialog("", "Selecione uma central para adicionar o motorista", undefined, "warning");
            return;
        }

        if (btn) btn.disabled = true;

        if (typeof preload === "function") preload(true);
        CentralRepository
            .addDriver(idCentral, idDriver, isFavorite).then(({message, status}) => {
                if (typeof preload === "function") preload(false);

                if (!status) {
                    SwalCustom.messageDialog("", getResponseMessage(message, "Não foi possível adicionar o motorista na central"), undefined, "info");
                    return;
                }

                SwalCustom.messageDialog("", getResponseMessage(message, "Motorista adicionado com sucesso"), undefined, "success");

                if (typeof showList === "function") showList(idCentral);
                if (typeof window.refreshActiveDriversList === "function") window.refreshActiveDriversList();

                if (document.getElementById("modalAddDriverInCentral")) {
                    $("#modalAddDriverInCentral").modal('hide');
                }
            }).catch((err) => {
                if (typeof preload === "function") preload(false);
                console.error("Erro ao adicionar motorista:", err);
                SwalCustom.messageDialog("", "Erro ao adicionar motorista na central", undefined, "error");
            }).finally(() => {
                if (btn) btn.disabled = false;
            });
    }

    function validateCode(value) {
        return /(([A-Z]){2})+(([0-9]){5})+(([A-Z]){1})/g.test(value);
    }

    function getResponseMessage(message, fallback) {
        if (Array.isArray(message)) {
            return message[0] || fallback;
        }
        return message || fallback;
    }
});
