const city = Session.getLocal("citySelected");
cityId = city.cityId;
getAcquires();

const isRoot = Session.get('user').roleId

function getAcquires() {
    preload(true);
    AcquirerByCityController.getAcquiresByCIty().then(({response}) => {
        document.querySelector("#acquirerList").innerHTML = response.map(item => {
            return `<div class="form-check form-check-inline">
                      <input 
                            class="form-check-input change-acquirer" 
                            type="radio" 
                            name="acquirerRadio" 
                            id="acquirerRadio${item.idFinancialIntermediary}" 
                            value='${JSON.stringify(item)}'
                            ${item.active == true ? "checked" : ""}>
                      <label class="form-check-label" for="acquirerRadio${item.idFinancialIntermediary}">${item.name}</label>
                    </div>`
        }).join("");
        preload(false);

        const item = response.find(item => item.active == true);
        showDataForm(item);

        elementProperty.addEventInElement(".change-acquirer", "onclick", function () {
            showDataForm(JSON.parse(this.getAttribute("value")));
        });

        preload(false);
    });

function showDataForm(item) {
    if(!item || item?.dontShow)
        return swal('', 'Não há adquirentes ativas para a cidade selecionada.', 'info');

    document.querySelector("#containerForm").innerHTML = `
        <div class="card m-2">
          <div class="card-header">
            ${item.name}
          </div>
          <div class="card-body">
            <div>
            ${item.acquirer_meta_data.map(data => {
        return `<div class="form-group">
                    <label>${data.description}</label>
                    <input type="text" class="form-control input-value-acquirer" id="${data.key}" value="${data.value || ""}" ${isRoot !== 1 && data.isRoot === 1 ? 'readonly' : ''}>
                </div>`
    }).join("")}
                <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary d-none" id="btnRemoveAcquirer">Remover</button>
                    <button type="submit" class="btn btn-primary" id="btnSaveAcquirer">Salvar</button>
                </div>
            </div>
          </div>
        </div>
    `;

    if(item.active) {
        document.querySelector("#btnRemoveAcquirer").classList.remove('d-none')
    } else {
        document.querySelector("#btnRemoveAcquirer").classList.add('d-none')
    }

    elementProperty.addEventInElement('.input-value-acquirer', 'onkeypress', function(e) {
        if(e.keyCode == 13) {
            saveAcquirer(item, showDataForm)
        }
    })

    elementProperty.addEventInElement("#btnSaveAcquirer", "onclick", function() {
        saveAcquirer(item, showDataForm)
    });

    elementProperty.addEventInElement("#btnRemoveAcquirer", "onclick", function () {
        removeAcquirer(item, showDataForm)
    })

}
}

function removeAcquirer(item, showDataForm) {
    swal({
        title: "Confirma remoção de adquirente?",
        text: "Remoção de adquirente irá excluir coletivamente os números dos cartões de crédito dos usuários ja cadastrados, podendo causar falhas ou exigir recadastramento dos mesmos.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: ['Cancelar', 'Confirmar']
    }).then((willConfirm) => {
        if (willConfirm) {
            const metadata = elementProperty.getElements(".input-value-acquirer").map((element) => {
                return {key: element.getAttribute("id"), cityId}
            });
        
            preload(true);
            AcquirerByCityController.disableAcquire(metadata).then(({status, message}) => {
                preload(false);
                SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                    document.querySelector("#containerForm").innerHTML = "";
                    const checkBoxs = document.getElementsByClassName('change-acquirer');
                    checkBoxs[0].checked = false
                    for (var i = 0; i < checkBoxs; i++) {
                        let checkBox = checkBoxs[i].checked 
                        if(checkBox) {
                            checkBox = false
                        }
                    }
                    const newItem = item
                    newItem.active = false
                    newItem.dontShow = true
                    showDataForm(newItem)
                })
            });
        }
    });
}

function saveAcquirer(item, showDataForm) {
    swal({
        title: "Confirma alteração de adquirente?",
        text: "Mudança de adquirente pode excluir coletivamente os números dos cartões de crédito dos usuários ja cadastrados, podendo causar falhas ou exigir  recadastramento dos mesmos.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: ['Cancelar', 'Confirmar']
    }).then((willConfirm) => {
        if (willConfirm) {
            const acquirer = JSON.parse(document.querySelector(".change-acquirer:checked").value);
            const metadata = elementProperty.getElements(".input-value-acquirer").map((element) => {
                return {value: element.value, key: element.getAttribute("id"), cityId: cityId}
            });
        
            preload(true);
            AcquirerByCityController.updateAcquires(acquirer.idFinancialIntermediary, metadata, ).then(async ({status, message}) => {
                preload(false);
                SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                    getAcquires()
                });
            });
        }
    });
}