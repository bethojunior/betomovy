document.addEventListener("DOMContentLoaded", () => {
    preload(true);

    Mask.setMaskPhone('#phoneNumberTest');

    getData()

    async function getData() {
        const { response } = await ExternalServiceController.getAll();

        document.querySelector("#servicesList").innerHTML = response.map(item => {
            return `<div class="form-check form-check-inline">
                      <input 
                            class="form-check-input change-external-service" 
                            type="radio" 
                            name="externalServiceRadio" 
                            id="externalServiceRadio${item.id}" 
                            value='${JSON.stringify(item)}'
                            ${item.active == true ? "checked" : ""}>
                      <label class="form-check-label" for="acquirerRadio${item.id}">${item.name}</label>
                    </div>`
        }).join("");

        const externalServiceActive = response.find(item => item.active == true);

        showDataForm(externalServiceActive);

        elementProperty.addEventInElement(".change-external-service", "onclick", function () {
            showDataForm(JSON.parse(this.getAttribute("value")));
        });

        elementProperty.addEventInElement("#btnTestKeyService", "onclick", testKeyService);

        elementProperty.addEventInElement("#phoneNumberTest", "onkeypress", function (e) {
            if(e.which == 13){
                testKeyService();
            }
        });

        preload(false);
    }

    function showDataForm(externalService) {
        document.querySelector("#containerForm").innerHTML = `
            <div class="card m-2">
              <div class="card-header">
                Chaves
              </div>
              <div class="card-body">
                <form id="externalServiceForm">
                ${externalService.external_service_meta_data.map(item => {
            return `<div class="form-group">
                                        <label>${item.description}</label>
                                        <input type="text" class="form-control input-value-external-service" id="${item.key}" value="${item.value || ""}">
                                      </div>`
        }).join("")}
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary" id="btnSaveExternalService">Salvar</button>
                    </div>
                </form>
              </div>
            </div>
        `;

        elementProperty.addEventInElement("#externalServiceForm", "onsubmit", (event) => {
            event.preventDefault();

            swal({
                title: "Confirmar a alteração da chave?",
                text: "Mudança da chave pode parar o serviço de envio de sms, podendo causar falhas no cadastro!.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ['Cancelar', 'Confirmar']
            }).then((willConfirm) => {
                if (willConfirm) {
                    const externalService = JSON.parse(document.querySelector(".change-external-service:checked").value);

                    const metadata = elementProperty.getElements(".input-value-external-service").map((element) => {
                        return {value: element.value, key: element.getAttribute("id")}
                    });

                    if (metadata[0].value === "") {
                        SwalCustom.messageDialog("", "Valor da primeira chave obrigatório!", "warning");
                        return;
                    }

                    preload(true);

                    ExternalServiceController.updateService(externalService.id, metadata).then(({status, message}) => {
                        preload(false);
                        SwalCustom.messageDialog("", message, status ? "success" : "info");
                    });
                }
            });
        });
    }

    function testKeyService() {
        const phone = document.getElementById('phoneNumberTest').value;

        if (phone.length === 0) {
            SwalCustom.messageDialog("","Numero de Telefone não pode ser vazio!" , "info");
            return;
        }

        preload(true);
        ExternalServiceController.testKeyServiceExternal(phone).then(({ status, message }) => {
            preload(false);
            SwalCustom.messageDialog("", status ? "Chave Funcionando!" : "Chave não funcional!", status ? "success" : "info");
        });
    }
});