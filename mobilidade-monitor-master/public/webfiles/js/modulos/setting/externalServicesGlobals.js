document.addEventListener("DOMContentLoaded", () => {
let elementProperty = new ElementProperty();

getData();

function getData() {
    preload(true);
    elementProperty.getElement('#mountServicesGlobals', element => {
        SettingController.getServicesGlobals().then(callback => {
            element.innerHTML = callback.response.map((response, index) => {
                let type = response.name;
                return `
        <div class="card" id="accordion${index}">
            <div class="card-header" id='heading${index}'>
                <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" 
                type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                    ${type}
                </button>
                </h2>
            </div>
            <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" 
                data-parent="#accordion${index}">
                <div class="card-body row">
                    ${mountTypes(response.external_services, response.id)}
                    <div class="col-12" id="contentService${response.id}"></div>
                </div>
            </div>
        </div>`;
            }).join("");

            // callback.response.map((response, index) => {
            //     if (index > 0) {
            //         formByExternalService(response.external_services[0], response.id)
            //     }
            // });

            elementProperty.addEventInElement(".radio-external-service", "onclick", function () {
                const item = JSON.parse(this.getAttribute("value"));
                formByExternalService(item, this.getAttribute("groupId"));
            });

            const buttonChecked = elementProperty.getElements('.radio-external-service').filter(element => element.checked === true);

            if (buttonChecked) {
                buttonChecked.map((_, index) => {
                    if(index < 4) {
                        const item = JSON.parse(buttonChecked[index].getAttribute("value"));
                        formByExternalService(item, buttonChecked[index].getAttribute("groupId"));
                    }
                })
            }

            preload(false);

            function mountTypes(items, id = null) {
                return items.map(item => {
                    return `<div class="form-check form-check-inline ml-4">
                        <input 
                            type="radio"
                            name="serviceRadio${id}" 
                            id="serviceRadio${item.id}" 
                            class="form-check-input radio-external-service" 
                            value='${JSON.stringify(item)}'
                            groupId='${id}'
                            ${item.active == true ? "checked" : ""}>
                        <label for="serviceRadio${item.id}">${item.name}</label>
                    </div>`;
                }).join('');
            }
            
        });
    });

    function formByExternalService(item, groupExternalServiceId) {
        document.querySelector(`#contentService${groupExternalServiceId}`).innerHTML = `
          <div class="card-body">
            <form id="serviceForm">
            ${item.external_service_meta_data.map(data => {
            return `<div class="form-group">
                            <label>${data.description}</label>
                            <input type="text" class="form-control input-value-service" group="${data.externalServiceId}" id="${data.key}" value="${data.value || ""}" required>
                        </div>`
        }).join("")}
                   <div class="d-flex justify-content-end">
                       <button type="button" class="btn btn-primary btnSaveServiceGlobal" idBtnSave="${groupExternalServiceId}">Salvar</button>
                   </div>
            </form>
        </div>`;

        elementProperty.addEventInElement(".btnSaveServiceGlobal", "onclick", function () {
            const groupId = this.getAttribute("idBtnSave");
            const id = JSON.parse(document.querySelector(`input[type='radio'][groupId='${groupId}']:checked`).value).id;

            SwalCustom.dialogConfirm('Você confirma a alteração do serviço global?', '', status => {
                if (status) {
                    let metadata = elementProperty.getElements(".input-value-service")
                        .filter(element => element.attributes.group.value == id).map((element) => {
                            return {key: element.getAttribute("id"), value: element.value};
                        });
                    const response = {
                        metadata
                    };

                    preload(true);
                    SettingController.updateServicesGlobals(id, response).then(({status}) => {
                        preload(false);
                        metadata = "";
                        if (!status)
                            return SwalCustom.messageDialog(
                                "Certifique-se que todos os campos estão preenchidos",
                                "Erro ao alterar o serviço!", "error");

                        SwalCustom.messageDialog("", "Serviço alterado com sucesso!", "success");
                    });
                }
            });
        });
    }
}
});