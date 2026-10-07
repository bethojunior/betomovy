document.addEventListener("DOMContentLoaded", function () {
    const managerStepper = {
        listDefault: [],
        listExist: []
    };

    preload(true);

    UserController.userTypeDrivers().then(({response}) => {
        elementProperty.getElement("#driverControlSelect", element => {
            element.innerHTML = `<option value="" selected disabled>Selecione o tipo de motorista</option>` +
                response.map(item => {
                    return `<option value="${item.idUserType}">${item.name}</option>`;
                }).join("")
        })
    }).finally(() => {
        preload(false);
    });

    elementProperty.addEventInElement("#driverControlSelect", "onchange", function () {
        updateListSteps(this.value);
    });

    function updateListSteps(id) {
        preload(true);
        Promise.all([
            ConfigController.formStep(),
            ConfigController.formStepUserType(id)
        ]).then(values => {
            const allStep = values[0].response;
            const userTypeSteps = values[1].response;

            managerStepper.listDefault = allStep.filter(item => {
                return userTypeSteps.find(itemUserType => {
                    return itemUserType.formStepId === item.id;
                }) == null;
            });

            managerStepper.listExist = userTypeSteps;

            createListDocument();

            document.querySelector("#formSelected").style.display = "block";

        }).finally(() => {
            preload(false);
        })
    }


    function createListDocument() {
        elementProperty.getElement("#listDefault", element => {
            element.innerHTML = ` <li class="list-group-item active">Adicionar</li>`;
            element.innerHTML += managerStepper.listDefault.map(item => {
                return `<li>
                        <span>${item.description}</span>
                        <button type="button" class="btn btn-primary btn-add-item" valueItem='${JSON.stringify(item)}'>
                            Adicionar
                        </button>
                    </li>`;
            }).join("");
        });
        elementProperty.getElement("#listExist", element => {
            element.innerHTML = ` <li class="list-group-item active">Atual</li>`;
            element.innerHTML += managerStepper.listExist.map(item => {
                return `<li>
                        <span>${item.form_step.description}</span>
                        ${item.form_step.manageable == true ?
                    `<button type="button" class="btn btn-warning btn-remove-item" valueItem='${JSON.stringify(item)}'>
                            Remover
                        </button>` : ""}
                    </li>`;
            }).join("");
        });

        elementProperty.addEventInElement(".btn-add-item", "onclick", function () {
            const stepper = JSON.parse(this.getAttribute("valueItem"));

            const userTypeId = document.querySelector("#driverControlSelect").value;

            preload(true);
            ConfigController.insertFormStepUserType({userTypeId, formStepId: stepper.id}).then(() => {
                preload(false);
                updateListSteps(userTypeId);
            });
        });

        elementProperty.addEventInElement(".btn-remove-item", "onclick", function () {
            const stepper = JSON.parse(this.getAttribute("valueItem"));
            SwalCustom.dialogConfirm("Deseja remover esse passo no cadastro ?", "", status => {
                if (!status)
                    return;
                preload(true);
                ConfigController.removeFormStepUserType(stepper.id).then(() => {
                    preload(false);
                    updateListSteps(document.querySelector("#driverControlSelect").value);
                });
            });
        });
    }


});