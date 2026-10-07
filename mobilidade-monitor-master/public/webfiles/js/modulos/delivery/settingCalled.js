document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    DeliveryCallConfigController.deliveryCallConfig().then(({response}) => {
        createFormSetting(response);
    }).finally(() => {
        preload(false);
    });

    function createFormSetting(response) {
        elementProperty.getElement("#accordionFormSettingCalled", element => {
            element.innerHTML = response.map((item, index) => {
                return `<div class="card">
                    <div class="card-header" id="heading${index}">
                      <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}" 
                        aria-expanded="true" aria-controls="collapseOne">${item.description.trim()}
                        </button>
                      </h2>
                    </div>
                
                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}">
                      <div class="card-body">
                        ${checkTypeField(item)}
                      </div>
                    </div>
                  </div>`;
            }).join("");


            elementProperty.addEventInElement(".change-status-setting", "onchange", function () {
                const element = document.querySelector(`label[for='${this.getAttribute("id")}']`);

                if (this.checked) {
                    element.innerHTML = "Ativado";
                } else {
                    element.innerHTML = "Desativado";
                }

                const data = {};

                data[this.getAttribute("id")] = this.checked;

                SettingController.ConfigByCity(METHOD_REQUISITION['editar'], data);
            });

            elementProperty.addEventInElement(".btn-save-setting", "onclick", function () {
                const element = document.querySelector(`#${this.getAttribute("for")}`);


                switch (element.getAttribute("type")) {
                    case "number" : {
                        if (isNaN(parseFloat(element.value)))
                            return alert("O valor do campo deve ser numerico");
                        break;
                    }
                    case "url" : {
                        if (!validURL(element.value))
                            return alert("O linkestá inválido!");
                        break;
                    }
                }

                preload(true);

                DeliveryCallConfigController.updateDeliveryCallConfig(this.getAttribute("for"),element.value).then(({status}) => {
                    if (!status)
                        return swal('Erro ao atualizar', 'Contate o suporte', 'error');

                    swal('Atualizado com sucesso', '', 'success');
                }).finally(() => preload(false));
            });

            elementProperty.addEventInElement(".change-status-setting", "onchange", function () {
                const element = document.querySelector(`label[for='${this.getAttribute("id")}']`);

                if (this.checked) {
                    element.innerHTML = "Ativado";
                } else {
                    element.innerHTML = "Desativado";
                }

                const data = {};

                data[this.getAttribute("id")] = this.checked;

                DeliveryCallConfigController.updateDeliveryCallConfig()
            });

            elementProperty.addEventInElement(".btn-save-setting-accept", "onclick", function () {
                //preload(true);
            })
        });
    }

    function checkTypeField(object) {
        switch (object.fieldType) {
            case "boolean": {
                return `<div class="custom-control custom-switch">
                      <input type="checkbox" class="custom-control-input change-status-setting change-status=" id="${object.key}" ${object.value == true ? "checked" : ""}>
                      <label class="custom-control-label" for="${object.key}">${object.value == true ? "Ativado" : "Desativado"}</label>
                    </div>`
            }
            case "link": {
                return `<div class="col-lg-6">
                     <div class="form-group">
                        <input type="url" class="form-control" id="${object.key}" value="${object.value || ""}">
                      </div>
                        <button type="button" class="btn btn-primary btn-save-setting" for="${object.key}">Salvar</button>
                  </div>`;
            }
            case "json": {
                return createFieldsByObject(object.value);
            }
            default : {
                return `<div class="col-lg-6">
                     <div class="form-group">
                        <input type="${object.fieldType}" class="form-control" id="${object.key}" value="${object.value || ""}">
                      </div>
                        <button type="button" class="btn btn-primary btn-save-setting" for="${object.key}">Salvar</button>
                  </div>`
            }
        }
    }

    function validURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    function createFieldsByObject(object) {
        return Object.keys(object).map(key => {
            return Object.keys(fieldsTypeJSON[key]).map(attribute => {
                return `<div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="${attribute}" ${object[key][attribute] == true ? "checked" : ""}>
          <label class="custom-control-label" for="${attribute}">${fieldsTypeJSON[key][attribute]}</label>
        </div>`
            }).join("");
        }).join("") + ` <button type="button" class="btn btn-primary btn-save-setting-accept">Salvar</button>`;
    }

    function checkTrue(status) {
        if (status === 'on')
            return true;
        return false;
    }
});