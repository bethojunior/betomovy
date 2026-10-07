preload(true);
let element = new ElementProperty();
$('.collapse').collapse();
$('#myList a').on('click', function (e) {
    e.preventDefault();
    $(this).tab('show')
});

initCharge();

function initCharge() {
    preload(true);
    Mask.setMoneyField(".input-mask-money");
    element.getElement('#list-type-trip', these => {
        const getType = DriverController.getTypeUsersV2();
        const getBalanceFlowType = FinancialController.balanceFlowType();
        Promise.all([getType, getBalanceFlowType]).then((result) => {
            const data = result[0].response;
            const balanceFlowType = result[1].response;
            let content = '';
            let contentValue = '';
            if (result[0].status) {
                content += data.map(item => {
                    return `
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#list-${item.idUserType}"  role="tab" aria-controls="home">${item.name}</a>
                `;
                }).join('');

                contentValue += data.map(item => {
                    return `
                    <div class="tab-pane fade show that-type" data-id="${item.idUserType}" id="list-${item.idUserType}" role="tabpanel" aria-labelledby="list-home-list">
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">Selecione como deve ser inserido</label>
                            <select class="form-control mount-balance" id="balanceFlowTypeId-${item.idUserType}" name="balanceFlowTypeId-${item.idUserType}">
                                ${balanceFlowType.map(item => {
                        return `
                                        <option value='${item.idBalanceFlowType}'>${item.name}</option>
                                    `;
                    })}
                            </select>
                            <br>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Valor</span>
                                </div>
                                <input id="value-balance-${item.idUserType}" class="form-control value-balance"  aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="form-check">
                              <input class="form-check-input recurrence-type" type="radio" name="recurrenceType${item.idUserType}" value="0" userType="${item.idUserType}" checked>
                              <label class="form-check-label" for="recurrenceType${item.idUserType}">
                                  Única vez
                              </label>
                            </div>
                            <div class="form-check mb-3">
                              <input class="form-check-input recurrence-type" type="radio" name="recurrenceType${item.idUserType}" value="1" userType="${item.idUserType}">
                              <label class="form-check-label d-flex align-items-center" for="recurrenceType${item.idUserType}">
                                <label>Recorrente dia</label><input type="number" value="1" class="form-control w-25 ml-2 text-center" id="inputRecurrenceType${item.idUserType}"  disabled>
                              </label>
                            </div>
                            <button type="button" id="${item.idUserType}" class="btn btn-primary add-balance-trip-type">Adicionar</button>
                        </div>
                    </div>
                `;
                }).join('');
                preload(false);
            }

            these.innerHTML = content;

            element.getElement('#nav-type-trip', these => {
                these.innerHTML = contentValue;
            });

            elementProperty.addEventInElement(".recurrence-type", "onchange", function () {
                document.querySelector(`#inputRecurrenceType${this.getAttribute("userType")}`).disabled = !(this.value == true);
            });

            elementProperty.addEventInElement('.add-balance-trip-type', 'onclick', function () {
                SwalCustom.confirm('Deseja inserir pendencia mensal?', 'Essa ação vai vai impactar o saldo dos motoristas ').then(status => {
                    if (!status) {
                        return true;
                    }
                    let data = {};
                    data.balanceFlowTypeId = document.getElementById(`balanceFlowTypeId-` + this.getAttribute('id')).value;
                    data.userTypeId = this.getAttribute('id');
                    data.value = Mask.removeMaskMoney(document.getElementById('value-balance-' + data.userTypeId).value);

                    if (data.value === 0)
                        return swal('Insira um valor', '', 'info');


                    if (document.querySelector(`#inputRecurrenceType${data.userTypeId}`).disabled) {
                        preload(true);
                        FinancialController.updateBalanceDriver(data).then(({status, response, message}) => {
                            preload(false);

                            if (!status) {
                                return SwalCustom.messageDialog('', `${message}`, 'info');
                            }
                            initCharge();
                            swal('', message, 'success')
                        });
                    } else {
                        data.billingDay = document.querySelector(`#inputRecurrenceType${data.userTypeId}`).value;

                        if (isNaN(parseInt(data.billingDay)))
                            return alert("Informe a data da recorrencia");

                        preload(true);

                        FinancialController.balancePosting(data).then(({status}) => {
                            if (!status) {
                                return SwalCustom.messageDialog('Reveja as informações e tente novamente', 'Não foi possível criar esse lançamento', 'error');
                            }

                            SwalCustom.messageDialog("", "Lançamento criado com sucesso!", "success").then(() => {
                                location.reload();
                            });
                        }).finally(() => {
                            preload(false)
                        })
                    }
                });
            });
            preload(false);
            Mask.setMoneyField('.value-balance');
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    FinancialController.getBalancePosting().then(({response}) => {
        document.querySelector("#listBalancePosting").innerHTML = response.map(item => {
            return `<tr>
                    <td>${item.balance_flow_type.name}</td>
                    <td>${item.balance_flow_type.flow}</td>
                    <td>${Mask.maskMoney(item.value)}</td>
                    <td>${item.billingDay}</td>
                    <td>${item.user_type.name}</td>
                    <td><button type="button" class="btn btn-primary btn-remove-balance" balance='${JSON.stringify(item)}'>Excluir</button></td>
                </tr>`
        }).join("");

        elementProperty.addEventInElement(".btn-remove-balance", "onclick", function () {
            const item = JSON.parse(this.getAttribute("balance"));
            SwalCustom.dialogConfirm("Deseja remover esse lançamento?", "", status => {
                if (status) {
                    preload(true);
                    FinancialController.removeBalancePosting(item.id).then(({status, response, message}) => {
                        SwalCustom.messageDialog(response[0] || "", message, status ? "success" : "info").then(() => {
                            if (status)
                                location.reload();
                        })
                    }).finally(()=>{
                        preload(false);
                    })
                }
            });
        });
    });
});