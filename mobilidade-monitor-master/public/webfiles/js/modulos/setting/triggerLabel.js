document.addEventListener("DOMContentLoaded", () => {
    const city = Session.getLocal("citySelected");

    createListTrigger();
    createTrigger();

    function createListTrigger() {
        TriggerController.getAllTriggerDynamic().then(({response}) => {
            document.getElementById("listTrigger").innerHTML =
                response.map(item => {
                    return `
                     <tr>
                        <td> ${item?.timeStart} à ${item?.timeEnd} </td>
                        <td> ${item?.week_day?.description} </td>
                        <td> ${item?.trip_type?.type} </td>
                        <td> R$${Mask.maskMoney(item?.multiplierValue)}</td>
                        <td>
                            <button id="${item?.idPriceDynamic}" idTrigger="${item?.idPriceDynamic}" statusTrigger='${item?.active}' class="btn-edit-trigger btn btn-secondary p-2">
                                ${item?.active ? 'ativado' : 'desativado'}
                            </button>
                        </td>
                        <td>
                            <button idTrigger="${item?.idPriceDynamic}" class="btn-find-trigger">
                               <i class="material-icons">edit</i>
                            </button>
                        </td>
                        <td>
                            <button idVoucher="${item?.idPriceDynamic}" class="btn-delete-trigger">
                               <i class="material-icons">delete</i>
                            </button>
                        </td>
                     </tr>
            `
                }).join("");
            preload(false);

            elementProperty.addEventInElement('.btn-delete-trigger', 'onclick', deleteTriggerDynamic);
            elementProperty.addEventInElement('.btn-add-trigger', 'onclick', saveTrigger);
            elementProperty.addEventInElement('.btn-edit-trigger', 'onclick', changeStatus);

            const editButtons = document.querySelectorAll('.btn-find-trigger');
            editButtons.forEach(button => {
                button.addEventListener('click', () => {
                    openEditModal(button.getAttribute('idTrigger'));
                });
            });
        });
    }

    function openEditModal(idTrigger) {
        preload(true);
        TriggerController.showTrigger(idTrigger).then(({ response }) => {
            const modalityEditSelect = document.getElementById('modalityEdit');
            modalityEditSelect.innerHTML = '';

            CityController.getTripTypesV2().then(({ response: data }) => {
                const tripModality = data.map(item => {
                    return `<option value="${item.tripTypeId}">${item.type}</option>`;
                }).join("");

                modalityEditSelect.innerHTML += tripModality;
                modalityEditSelect.value = response.trip_type.idTripType;

                document.getElementById('inputRateEdit').value = Mask.maskMoney(response.multiplierValue);
                document.getElementById('startDateEdit').value = response.timeStart;
                document.getElementById('endDateEdit').value = response.timeEnd;
                const dayOfWeek = response.week_day.day;

                const radioButtons = document.querySelectorAll('input[name="days-of-week-edit"]');
                radioButtons.forEach(radioButton => {
                    if (radioButton.value === dayOfWeek.toString()) {
                        radioButton.checked = true;
                    } else {
                        radioButton.checked = false;
                    }
                });

                const saveButton = document.querySelector('.btn-update-trigger');
                saveButton.setAttribute('data-id-trigger', idTrigger);

                preload(false);
                $('#triggerModalEdit').modal('show');
            });
        });
    }

    elementProperty.addEventInElement('.btn-update-trigger', 'onclick', function () {
        const idTrigger = this.getAttribute('data-id-trigger');
        const selectedDayOfWeek = document.querySelector('input[name="days-of-week-edit"]:checked').value;

        TriggerController.updateTrigger(idTrigger, {
            "cityId": city.cityId,
            "tripTypeId": document.getElementById('modalityEdit').value,
            "multiplierValue": Mask.removeMaskMoney(document.getElementById('inputRateEdit').value),
            "timeStart": document.getElementById('startDateEdit').value,
            "timeEnd": document.getElementById('endDateEdit').value,
            "dayOfWeek": selectedDayOfWeek,
            "timezoneOffset": new Date().getTimezoneOffset()
        }).then(({ status, response }) => {
            if (!status) {
                SwalCustom.messageDialog("", response[0], "info");
                return;
            }
            SwalCustom.messageDialog("", "Gatilho atualizado com sucesso!", "success")
                .then(() => {
                    $('#triggerModalEdit').modal('hide');
                    createListTrigger();
                });
        });
    });

    function deleteTriggerDynamic() {
        const id = this.getAttribute('idVoucher');
        SwalCustom.confirm("Tem certeza que deseja deletar o gatilho?").then(() => {
            TriggerController.deleteTriggerDynamic(id).then(response => {
                if (!response.status) {
                    SwalCustom.messageDialog("", response.message, "info");
                    return
                }
                SwalCustom.messageDialog("", response.message, "success");
                createListTrigger();
            })
        })
    }

    function changeStatus() {
        const id = this.getAttribute('idTrigger');
        const status = parseInt(this.getAttribute('statusTrigger')) ? 'disable' : 'enable';
        preload(true);
        TriggerController.releaseTriggerDynamic(id, status).then(() => {
            createListTrigger();
            SwalCustom.messageDialog('Status atualizado com sucesso!', '', 'success');
        });
    }

    function createTrigger() {
        preload(true);
        CityController.getTripTypesV2().then(({response: data}) => {
            preload(true);

            const tripModality = data.map(item => {
                return `                       
                <option value="${item.tripTypeId}">${item.type}</option>
                   `
            }).join("");
            preload(false);

            Mask.setMoneyField(".rates-input");

            document.querySelector(".select-modality").innerHTML += tripModality;
        });
    }

    elementProperty.addEventInElement(".all-day-week", "onchange", function () {
        const isChecked = this.checked;
        document.querySelectorAll(".days-week").forEach(elementCheck => {
            elementCheck.checked = isChecked;
        });
    });

    elementProperty.addEventInElement(".days-week", "onclick", function () {
        if(!this.checked)
            document.querySelector(".all-day-week").checked = false;

        if(elementProperty.getElements(".days-week").filter(element => !element.checked).length === 0)
            document.querySelector(".all-day-week").checked = true;
    });

    function saveTrigger() {
        $('.modal-add-trigger').modal('show');

        elementProperty.addEventInElement(".btn-save-trigger", "onclick", function () {
            let modalitySelected = document.getElementById('modality').value;
            let rate = Mask.removeMaskMoney(document.querySelector('.rates-input').value);
            let dateStart = document.querySelector('#startDate').value;
            let dateEnd = document.querySelector('#endDate').value;

            function compareHour(hour1, hour2) {
                hour1 = hour1.split(":");
                hour2 = hour2.split(":");

                let d = new Date();
                let date1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour1[0], hour1[1]);
                let date2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour2[0], hour2[1]);

                return date1 > date2;
            }


            if (modalitySelected === "") {
                SwalCustom.messageDialog("Selecione uma das modalidades.");
                return;
            }

            if (rate <= 0) {
                SwalCustom.messageDialog("O valor da taxa dever ser maior que zero!");
                return;
            }

            if (dateStart === "" || dateEnd === "") {
                SwalCustom.messageDialog("Selecione o horário de funcionamento do gatilho.");
                return;
            }

            if (compareHour(dateStart, dateEnd)) {
                SwalCustom.messageDialog("A hora final deve ser maior que hora inicial.");
                return;
            }
            const dayOfWeek = elementProperty.getElements(".days-week").filter(element => element.checked).map(element => element.value);

            const triggers = {
                "cityId": city.cityId,
                "tripTypeId": [modalitySelected],
                "multiplierValue": rate,
                "timeStart": `${dateStart}`,
                "timeEnd": `${dateEnd}`,
                "dayOfWeek": dayOfWeek,
                "timezoneOffset": new Date().getTimezoneOffset()
            };

            preload(true);

            TriggerController.insertDynamic(triggers).then((data) => {
                preload(false);
                if (!data.status)
                    return SwalCustom.messageDialog("Já existe um gatilho para essa data e horário", data.response[0], "info")

                $('.modal-add-trigger').modal('hide').on('hidden.bs.modal', function () {
                    $(this).find('.rates-input').val('');
                    $(this).find('.time').val('');
                    document.querySelectorAll(".days-week").forEach(elementCheck => {
                        elementCheck.checked = false;
                    });
                });
                SwalCustom.messageDialog("", "Gatilho adicionado com sucesso!", "success")
                    .then(() => createListTrigger());
            });
        });
    }
});

