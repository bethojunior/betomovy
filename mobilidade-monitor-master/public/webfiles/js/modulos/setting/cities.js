const fieldsTypeJSON = {
    accept: {
        price: "Preço da viagem (Mesmo DESATIVADO, pode ser exposto na última tela para cobrança quando o pagamento for no veiculo)",
        origin: "Origem da viagem",
        reward: "Bonus da viagem",
        favorite: "Mostra quando a viagem for para motorista favorito",
        destination: "Destino da viagem",
        paymentForm: "Forma de pagamento",
        estimatedTime: "Estimativa de tempo do motorista até o cliente",
        estimatedDistance: "Distância do motorista até cliente",
        quantityWaypoints: "Quantidade de paradas",
        ratingCustomer: "Nota do cliente",
        quantityTripsCustomer: "Quantidade de viagens do cliente",
    }
};


const configPrivates = {
    showDynamicAreaInMap: PermissionUser.hasPermission(TARIFAS, "gerenciar_dinamica_area"),
    showRiskAreaInCall: PermissionUser.hasPermission(CONFIGURACAO, "gerenciar_area_risco")
};

document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    SettingController.ConfigByCity(METHOD_REQUISITION['listar']).then(({status, response, message}) => {
        if (!status)
            return swal('Contate o supote', message, 'error');

        createFormSetting(response);
    }).finally(() => {
        preload(false);
    });
});

function createFormSetting(response) {
    elementProperty.getElement("#accordionFormSetting", element => {
        const timezone = response.find((res) => {
            return res.attribute == 'timezone'
        });
        if(timezone.value) {
            Session.set('timezone-city', timezone.value)
        }
        element.innerHTML = response.filter(item=>{
            if(configPrivates[item.attribute] == null)
                return true;

            return configPrivates[item.attribute];
        }).map((item, index) => {
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

        elementProperty.addEventInElement("#select-timezone", "onchange", function () {
            const data = {};

            data.timezone = this.value;

            preload(true);

            SettingController.ConfigByCity(METHOD_REQUISITION['editar'], data).then(({status}) => {
                if (!status)
                    return swal('Erro ao atualizar', 'Contate o suporte', 'error');

                swal('Atualizado com sucesso', '', 'success').then(() => {
                    window.location.reload()
                });
            }).finally(() => preload(false));

        });

        elementProperty.addEventInElement(".btn-save-setting", "onclick", function () {
            const element = document.querySelector(`#${this.getAttribute("for")}`);

            if(!validateValueByType(element.value, this.getAttribute("for")))
                return ;

            const data = {};

            data[element.getAttribute("id")] = element.value;

            switch (element.getAttribute("type")) {
                case "number" : {
                    if (isNaN(parseFloat(element.value)))
                        return alert("O valor do campo deve ser numerico");
                    break;
                }
                case "url" : {
                    if (!validURL(element.value))
                        return alert("O linkestá inválido!")
                    break;
                }
            }

            preload(true);

            SettingController.ConfigByCity(METHOD_REQUISITION['editar'], data).then(({status}) => {
                if (!status)
                    return swal('Erro ao atualizar', 'Contate o suporte', 'error');

                swal('Atualizado com sucesso', '', 'success')
            }).finally(() => preload(false));
        });

        elementProperty.addEventInElement(".btn-save-setting-accept", "onclick", function () {
            preload(true);

            let data = {};
            data.enabledDriverFields = {};
            data.enabledDriverFields.accept = {};
            data.enabledDriverFields.accept.origin = checkTrue($("input[id='origin']:checked").val());
            data.enabledDriverFields.accept.destination = checkTrue($("input[id='destination']:checked").val());
            data.enabledDriverFields.accept.estimatedDistance = checkTrue($("input[id='estimatedDistance']:checked").val());
            data.enabledDriverFields.accept.estimatedTime = checkTrue($("input[id='estimatedTime']:checked").val());
            data.enabledDriverFields.accept.favorite = checkTrue($("input[id='favorite']:checked").val());
            data.enabledDriverFields.accept.paymentForm = checkTrue($("input[id='paymentForm']:checked").val());
            data.enabledDriverFields.accept.price = checkTrue($("input[id='price']:checked").val());
            data.enabledDriverFields.accept.quantityWaypoints = checkTrue($("input[id='quantityWaypoints']:checked").val());
            data.enabledDriverFields.accept.reward = checkTrue($("input[id='reward']:checked").val());
            data.enabledDriverFields.accept.ratingCustomer = checkTrue($("input[id='ratingCustomer']:checked").val());
            data.enabledDriverFields.accept.quantityTripsCustomer = checkTrue($("input[id='quantityTripsCustomer']:checked").val());

            SettingController.ConfigByCity(METHOD_REQUISITION['editar'], data).then(({status}) => {
                if (!status)
                    return swal('Erro ao atualizar', 'Contate o suporte', 'error');

                swal('Atualizado com sucesso', '', 'success')
            }).finally(() => {
                preload(false);
            });
        })
    });
}

function validateValueByType(value, type){
    if(type === "quantityTripWayPoints"){
        if(parseInt(value) > 10){
            SwalCustom.messageDialog("","Limite maximo de paradas é 10");
            return false;
        }
    }

    return true;
}

function checkTypeField(object) {

    if (object.attribute === "timezone") {
        object.inputType = "select-timezone";
    }

    switch (object.inputType) {
        case "boolean": {
            return `<div class="custom-control custom-switch">
                      <input type="checkbox" class="custom-control-input change-status-setting change-status=" id="${object.attribute}" ${object.value == true ? "checked" : ""}>
                      <label class="custom-control-label" for="${object.attribute}">${object.value == true ? "Ativado" : "Desativado"}</label>
                    </div>`
        }
        case "link": {
            return `<div class="col-lg-6">
                     <div class="form-group">
                        <input type="url" class="form-control" id="${object.attribute}" value="${object.value || ""}">
                      </div>
                        <button type="button" class="btn btn-primary btn-save-setting" for="${object.attribute}">Salvar</button>
                  </div>`;
        }
        case "json": {
            return createFieldsByObject(object.value);
        }
        case "select-timezone": {
            return `<div class="col-lg-6">
                     <div class="form-group">
                        <select class="form-control" id="select-timezone">
                            <option value="">Selecione</option>
                        ${Timezones.brazil.map(item => 
                            `<option value="${item}" ${item === object.value ? "selected" : ""}>${item}</option>`)
                        .join("")}
                        </select>
                        </div>
                    </div>`
        }
        default : {
            return `<div class="col-lg-6">
                     <div class="form-group">
                        <input type="${object.inputType}" class="form-control" id="${object.attribute}" value="${object.value || ""}">
                      </div>
                        <button type="button" class="btn btn-primary btn-save-setting" for="${object.attribute}">Salvar</button>
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