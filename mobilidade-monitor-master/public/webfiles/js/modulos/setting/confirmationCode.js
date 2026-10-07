document.addEventListener("DOMContentLoaded", () => {
    preload(true);

    getData();

    async function getData() {
        preload(true);
        const {response: listService} = await ExternalServiceController.getListServices();
        const {response: types} = await ExternalServiceController.getServicesTypes();
        document.querySelector("#containerConfirmationCode").innerHTML = `<div class="card" style="margin-bottom: 10px">
            <div class="card-header">
                Tipo do código de confirmação do cliente
            </div>
            <div class="card-body types-code">
            </div>
        </div>
        `;

        await getConfirmationCodeCustomer();

            document.querySelector("#listCards").innerHTML = listService.map(service => {
                return `<div class="card mb-2">
                        <div class="card-header">
                            ${service.external_service_action.name}
                        </div>
                        <div class="card-body m-1">
                            ${types.map(type => {
                    return `<div class="form-check form-check-inline">
                                            <input class="form-check-input change-service" type="checkbox" 
                                                service='${JSON.stringify(service)}' 
                                                serviceId="${service.id}"
                                                ${isTypeServiceChecked(service, type)}
                                                value="${type.id}" id="${type.name}${service.id}">
                                            <label class="form-check-label" for="${type.name}${service.id}">
                                                ${type.name}
                                            </label>
                                        </div>`
                }).join("")}
                        </div>
                    </div>`
            }).join("");

        elementProperty.addEventInElement(".change-service", "onclick", function () {
            const service = JSON.parse(this.getAttribute("service"));

            const typeSelected = document.querySelectorAll(`.change-service[serviceId='${service.id}']:checked`);

            if (typeSelected.length === 0)
                return false;

            const externalServiceTypeId = typeSelected.length === 1 ? typeSelected.item(0).value : null;

            preload(true);
            ExternalServiceController.updateExternalServiceActive(service.id, externalServiceTypeId).finally(() => {
                preload(false);
            });
        });

        preload(false)
    }

    function isTypeServiceChecked(service, type) {
        if (service.external_service_type == null)
            return "checked";

        return service.external_service_type.id === type.id ? "checked" : "";
    }

    async function getConfirmationCodeCustomer() {
        preload(true);
        const {response} = await ExternalServiceController.getConfirmationCodeCustomer();
        document.querySelector(".types-code").innerHTML = response.map((item) => {
            return `
                    <div class="form-check form-check-inline">
                        <input class="form-check-input change-type-${item.field}" type="checkbox" 
                            value="${item.field === "validateEmail" ? "email" : "sms"}"
                            ${item.required === 1 && item.compelField === 1 ? "checked" : ""}
                            >
                        <label class="form-check-label">
                            ${item.description}
                        </label>
                    </div>
                `
        }).join("");
        preload(false);
        elementProperty.addEventInElement(".change-type-validateSms", "onclick", function () {
            const type = this.value;
            const value = this.checked;

            const data = {
                type,
                value
            }

            preload(true);
            ExternalServiceController.changeTypeCodeConfirmation(data).then(() => {
                preload(false);
                SwalCustom.messageDialog("", "Tipo de código de confirmação alterado com sucesso!", "success").then(() => getData());
            });
        });

        elementProperty.addEventInElement(".change-type-validateEmail", "onclick", function () {
            const type = this.value;
            const value = this.checked;

            const data = {
                type,
                value
            }

            preload(true);
            ExternalServiceController.changeTypeCodeConfirmation(data).then(() => {
                preload(false);
                SwalCustom.messageDialog("", "Tipo de código de confirmação alterado com sucesso!", "success").then(() => getData());
            });
        });
    }
});