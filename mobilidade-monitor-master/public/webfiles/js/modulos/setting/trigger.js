const elementProperty = new ElementProperty()

const managerList = {
    cityId: null,
    stateId: null
};

document.getElementById("containerModality").style.display = "block"

elementProperty.getElement("#listTrigger", element => {
    createListTrigger()
});

getAllTypeTrip();

Mask.setMoneyField(".rates-input");

EstateController.getAllV2().then(({status, response: data, message}) => {

    if (!status) {
        SwalCustom.messageDialog("", message, "warning")
        return
    }

    elementProperty.getElement("#estate", element => {
        element.disabled = false;
        element.innerHTML += data.map(estate => `<option value="${estate.id}">${estate.nome}</option>`).join("")
    })
});


function createListTrigger() {
    preload(true);
    TriggerController.getAllTrigger().then(({response}) => {
        document.getElementById("listTrigger").innerHTML =
            response.map(item => {
                return `
                    <tr>
                        <td>${new Date(item.startDate).toLocaleString()}</td>
                        <td>${new Date(item.endDate).toLocaleString()}</td>
                        <td>${item.tripType}</td>
                        <td>${item.multiplierValue}</td>
                        <td>${item.tag}</td>
                        <td>
                            <button class='edit' onclick="editTrigger(${item.id})">
                            <i class="material-icons">edit</i></button>
                        </td>
                        <td>
                            <button class='delete' onclick="deleteTrigger(${item.id})">
                            <i class="material-icons">delete</i></button>
                        </td>
                    </tr>
                `
            }).join("");
        preload(false);
    })
}

function getAllTypeTrip() {
    CityController.getTripTypesV2().then(({status, response: data}) => {
        const element = document.getElementById("selectTypeTrip");

        element.innerHTML = ' <option value="" disabled selected>Selecione um tipo de viagem</option>';
        element.innerHTML += data.map(item => {
            return ` <option value="${item.tripTypeId}">${item.type}</option>`;
        }).join("");

        elementProperty.getElement(".time", element => {
            const date = new Date();

            element.value = DateCustom.getDateTimeInput(date)
        });

        elementProperty.addEventInElement(".option-tag-visibility", "onclick", function () {
            if (this.innerHTML === `<i class="material-icons">visibility</i>`) {
                this.innerHTML = `<i class='material-icons'>visibility_off</i>`;
                elementProperty.getElement("#tagTriggerVisibility", element => {
                    element.classList.add("active");
                    element.disabled = false;
                    element.value = '';
                    element.focus();
                });
            } else {
                this.innerHTML = `<i class="material-icons">visibility</i>`;
                elementProperty.getElement("#tagTriggerVisibility", element => {
                    element.classList.remove("active");
                    element.disabled = true;
                    element.value = `${Mask
                        .removeMaskMoney(document.querySelector(`#rate`).value).toFixed(1)}x`;
                });
            }
        });

        elementProperty.addEventInElement(".tag-value", "oninput", function () {
            setTimeout(() => {
                elementProperty.getElement("#tagText" + this.getAttribute("tag"), element => {
                    element.innerHTML = Mask.removeMaskMoney(this.value).toFixed(1);
                });
            }, 500)
        });

    });
}

elementProperty.addEventInElement("#rate", "onkeyup", function () {
    if(!document.getElementById(`tagTriggerVisibility`).classList.contains("active")){
        document.getElementById("tagTriggerVisibility").value = `${Mask
            .removeMaskMoney(document.querySelector(`#rate`).value).toFixed(1)}x`;
    }
});

elementProperty.addEventInElement("#add-trigger", "onclick", () => {
const tripTypeId = parseInt(document.querySelector("#selectTypeTrip").value);
    const objectTrigger = {
        "cityId": Session.getValueInSessionLocal("citySelected", "cityId"),
        "tripTypeId": [tripTypeId],
        "multiplierValue": Mask.removeMaskMoney(document.querySelector(`#rate`).value),
        "startDate": DateCustom.getDateEua(document.querySelector(`#startDate`).value),
        "endDate": DateCustom.getDateEua(document.querySelector(`#endDate`).value),
        "startDateUTC" : new Date(document.querySelector("#startDate").value).toISOString(),
        "endDateUTC" : new Date(document.querySelector("#endDate").value).toISOString()
    };

    objectTrigger.tag = document.getElementById(`tagTriggerVisibility`).classList.contains("active") ?
        document.getElementById("tagTriggerVisibility").value :
        `<div style="display: flex;justify-content: center;align-items: center;">` +
        `<i class="material-icons" style="font-size: 2vw;left: -0.5vw;position: relative;">trending_up</i>${Mask
            .removeMaskMoney(document.querySelector(`#rate`).value).toFixed(1)}x</div>`;

    if (isNaN(objectTrigger.tripTypeId)) {
        SwalCustom.messageDialog("Selecione o tipo de viagem");
        return;
    }

    if (objectTrigger.multiplierValue <= 0) {
        SwalCustom.messageDialog("O valor da taxa dever ser maior que zero!");
        return;
    }
    if (objectTrigger.tag.trim().length === 0) {
        SwalCustom.messageDialog("Informe a etiqueta");
        return;
    }

    if (new Date(objectTrigger.startDate) >= new Date(objectTrigger.endDate)) {
        SwalCustom.messageDialog("A data final deve ser maior que data inicial");
        return;
    }

    preload(true);

    TriggerController.sendTrigger(objectTrigger).then(({status, errors}) => {
        if (status === false)
            return SwalCustom.messageDialog("", errors[0].message, "info");

        SwalCustom.messageDialog("", "Gatilho atualizados", "success").then(() => {
            location.reload();
        });
    }).finally(() => {
        preload(false)
    });

});

function editTrigger(id) {
    preload(true);
    TriggerController.getTriggerById(id).then(({ status, response }) => {
        if (!status) {
            return SwalCustom.messageDialog("", "Ops.. Ocorreu um erro ao buscar o gatilho", "error");
        }

        CityController.getTripTypesV2().then(({ status, response: data }) => {
            const element = document.getElementById("selectTypeTripEdit");
            element.innerHTML = '';
            element.innerHTML += '<option value="" disabled>Selecione um tipo de viagem</option>';

            element.innerHTML += data.map(item => {
                const isSelected = item.tripTypeId === response.tripTypeId ? 'selected' : '';
                return `<option value="${item.tripTypeId}" ${isSelected}>${item.type}</option>`;
            }).join("");
        });

        elementProperty.addEventInElement("#rateEdit", "onkeyup", function () {
            if(!document.getElementById(`tagTriggerVisibilityEdit`).classList.contains("active")){
                document.getElementById("tagTriggerVisibilityEdit").value = `${Mask
                    .removeMaskMoney(document.querySelector(`#rateEdit`).value).toFixed(1)}x`;
            }
        });

        document.getElementById("rateEdit").value = response.multiplierValue;
        document.getElementById("startDateEdit").value = DateCustom.getDateTimeInput(new Date(response.startDate));
        document.getElementById("endDateEdit").value = DateCustom.getDateTimeInput(new Date(response.endDate));
        document.getElementById("tagTriggerVisibilityEdit").value = response.multiplierValue;
        document.getElementById("add-trigger-edit").setAttribute("data-id", response.id);
        document.getElementById("cancel-trigger-edit").setAttribute("data-id", response.id);

        $("#modalAddTriggerEdit").modal("show");

        preload(false);
    });
}

elementProperty.addEventInElement("#add-trigger-edit", "onclick", function () {
    updateTrigger(this.getAttribute("data-id"));
});
function updateTrigger(id) {
    preload(true);

    let multiplierValue = document.getElementById("rateEdit").value;

    if (multiplierValue.indexOf(",") !== -1) {
        multiplierValue = multiplierValue.replace(",", ".");
    }

    const updatedData = {
        "cityId": Session.getValueInSessionLocal("citySelected", "cityId"),
        "tripTypeId": parseInt(document.getElementById("selectTypeTripEdit").value),
        "multiplierValue": multiplierValue,
        "startDate": DateCustom.getDateEua(document.getElementById("startDateEdit").value),
        "endDate": DateCustom.getDateEua(document.getElementById("endDateEdit").value),
        "startDateUTC" : new Date(document.querySelector("#startDateEdit").value).toISOString(),
        "endDateUTC" : new Date(document.querySelector("#endDateEdit").value).toISOString()
    };

    const formattedMultiplierValue = parseFloat(multiplierValue).toFixed(1);
    updatedData.tag = document.getElementById(`tagTriggerVisibilityEdit`).classList.contains("active") ?
        document.getElementById("tagTriggerVisibilityEdit").value :
        `<div style="display: flex;justify-content: center;align-items: center;">` +
        `<i class="material-icons" style="font-size: 2vw;left: -0.5vw;position: relative;">trending_up</i>${formattedMultiplierValue}x</div>`;

    TriggerController.updateTriggerPriceDynamicScheduled(id, updatedData).then(({ status, response }) => {
        if (status) {
            createListTrigger();
            $("#modalAddTriggerEdit").modal("hide");
            SwalCustom.messageDialog("", "Gatilho atualizado com sucesso", "success");
        } else {
            SwalCustom.messageDialog("", "Ops.. Ocorreu um erro ao atualizar o gatilho", "error");
        }
        preload(false);
    });
}

function deleteTrigger(id) {
    SwalCustom.confirm("Tem certeza que deseja desativar o gatilho?").then(() => {
        TriggerController.deleteTrigger(id).then(({status}) => {
            if (!status) {
                return SwalCustom.messageDialog("Tente novamente", 'Ops.. Ocorreu um erro ao apagar seu gatilho', 'error');
            }
            SwalCustom.messageDialog("", 'Gatilho excluído com sucesso!', "success")
            createListTrigger();
        });
    });
}