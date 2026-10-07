document.addEventListener("DOMContentLoaded", function () {

    preload(true);

    Promise
        .all([getAllDrivers(), getUserTypeAll()])
        .then((values) => {
            showListDrivers(values[0]);
            showResponseDrivers(values[1]);
        })
        .finally(() => {
            preload(false);
        });

    function getAllDrivers() {
        return UserController.userTypeDrivers();
    }

    function showListDrivers({response}) {
        elementProperty.getElement("#listDrivers", element => {
            element.innerHTML += response.map(item => {
                return `<li class="list-group-item">
                                <div class="d-flex">
                                    <div class="form-check">
                                        <input class="form-check-input called-type-select-id" type="checkbox" value="${item.idUserType}" id="driver${item.idUserType}">
                                         <label for="driver${item.idUserType}">${item.name} <br> ID:${item.idUserType}</label>
                                    </div>
                                    <p class="mb-1"></p>
                                </div>
                                <small></small>
                            </li>`;
            }).join("");

            elementProperty.addEventInElement(".called-type-select-id", "onchange", function () {
                const userTypeId = this.getAttribute("value");
                const tripTypeId = document.querySelector("#calledTypeSelect").value;
                if (this.checked) {
                    preload(true);
                    TripTypeController.insertTripTypeDriver([
                        {
                            tripTypeId,
                            userTypeId
                        }
                    ]).then(({response}) => {
                        createSelected(response, tripTypeId)
                    }).finally(() => {
                        preload(false);
                    });
                } else {
                    preload(true);
                    TripTypeController.deleteTripTypeDriver([
                        {
                            tripTypeId,
                            userTypeId
                        }
                    ]).then(() => {
                        UserController.getUserTypeDrivers().then(({response}) => {
                            createSelected(response, tripTypeId)
                        });
                    }).finally(() => {
                        preload(false);
                    });
                }
            });
        });
    }


    function getUserTypeAll() {
        return UserController.getUserTypeDrivers();
    }

    function getIdParam() {
        const urlSplit = window.location.pathname.split("/");

        return urlSplit[urlSplit.length - 1];
    }

    function showResponseDrivers({response}) {
        const lastParam = getIdParam();

        if (lastParam) {
            if (!isNaN(parseInt(lastParam))) {
                document.querySelector("#btnNextStepTripType").hidden = false;
                document.querySelector("#calledTypeSelect").disabled = true;
                createSelected(response, lastParam);
                return;
            }
        }

        createSelected(response);
    }

    elementProperty.addEventInElement("#btnNextStepTripType", "onclick", function () {
        const stringObject = document.querySelector("#calledTypeSelect").selectedOptions[0].getAttribute("object");

        if (stringObject != null) {
            const tripType = JSON.parse(stringObject);
            if (tripType.trip_type_drivers.length > 0) {
                swal('Atrelamento de chamado feito com sucesso',
                    `1-Novo tipo de chamado(ok) 
                     2-Atrelar o tipo de chamado(ok)
                     3-Cadastro de tarifas(Próximo)`, 'success')
                    .then(() => {
                        location.href = `/setting/rates/${getIdParam()}`
                    });
            } else {
                alert("Você deve atrelar o chamado a pelo menos um tipo de motoristas!");
            }
        }

    });

    function createSelected(response, idTripType = null) {
        elementProperty.getElement("#calledTypeSelect", element => {
            element.innerHTML = `<option value="" selected disabled>Selecione o tipo de chamado</option>` +
                response.map(item => {
                    let select = "";

                    if (idTripType != null)
                        select = idTripType == item.idTripType ? "selected" : "";

                    return `<option value="${item.idTripType}"  object='${JSON.stringify(item)}' ${select}> ID:${item.idTripType} - ${item.type}</option>`;
                }).join("");

            if (idTripType)
                selectedTripTypeId();
        })
    }

    elementProperty.addEventInElement("#calledTypeSelect", "onchange", selectedTripTypeId);

    function selectedTripTypeId() {
        const stringObject = document.querySelector("#calledTypeSelect").selectedOptions[0].getAttribute("object");

        if (stringObject != null) {

            document.querySelector("#formSelected").style.display = "block";
            const tripType = JSON.parse(stringObject);

            elementProperty.getElement(".form-check-input", element => {
                element.checked = false;
            });

            tripType.trip_type_drivers.map(item => {
                const element = document.querySelector(`#driver${item.userTypeId}`);
                if (element != null)
                    element.checked = true;
            });
        }
    }
});