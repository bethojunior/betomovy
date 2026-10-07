document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#addDriverInCentral", "onclick", function () {
        addDriverCentral();
    });

    elementProperty.addEventInElement("#addDriver", "onclick", function () {
        const isFavorite = document.getElementById('favoriteCheckBox').checked
        addDriverCentral(isFavorite);
    });

    function addDriverCentral(isFavorite = false) {
        const code = document.getElementById("inputCodeDriver").value.toUpperCase();

        if (!validateCode(code)) {
            SwalCustom.messageDialog("", "Código inválido", undefined, "warning");
            return;
        }

        const idDriver = parseInt(code.replace(/[^0-9]/g, ""));

        const idCentral = Session.getValueInSession("centralSelected", "id");

        this.disabled = true;

        preload(true);
        CentralRepository
            .addDriver(idCentral, idDriver, isFavorite).then(({message, status}) => {
                preload(false);

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
        }).finally(() => {
            this.disabled = false;
        });
    }


    function validateCode(value) {
        return /(([A-Z]){2})+(([0-9]){5})+(([A-Z]){1})/g.test(value)
    }

    function getResponseMessage(message, fallback) {
        if (Array.isArray(message)) {
            return message[0] || fallback;
        }
        return message || fallback;
    }
});