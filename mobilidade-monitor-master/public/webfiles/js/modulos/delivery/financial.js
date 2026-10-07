document.addEventListener("DOMContentLoaded", function () {
    Mask.setMoneyField('.maskmoney');
    preload(true);
    list();
    selectedBillingDate();

    DeliveryPaymentFormController.listDeliveryPaymentForm().then(({response}) => {
        document.querySelector("#listPaymentDelivery").innerHTML = response.map(item => {
            return `<tr>
                        <td>${item.name}</td>
                        <td>${item.payment_form_type.description}</td>
                        <td><a href="#" class="edit-payment-form-delivery" value='${JSON.stringify(item)}'>Editar</a></td>
                        <td><a href="#" class="remove-payment-form-delivery" value="${item.id}">Excluir</a></td>
                    </tr>`;
        }).join("");

        elementProperty.addEventInElement(".edit-payment-form-delivery", "onclick", function () {
            const item = JSON.parse(this.getAttribute("value"));

            document.querySelector("#namePaymentFormDeliveryEdit").value = item.name;
            document.querySelector("#paymentFormTypeIdEdit").value = item.payment_form_type.id;

            $("#editPaymentFormDeliveryModal").modal('show');

            elementProperty.addEventInElement("#btnEditPaymentFormDelivery", "onclick", function () {
                SwalCustom.dialogConfirm("Editar informações de pagamento?", "", status => {
                    if (status) {
                        preload(true);
                        DeliveryPaymentFormController.update(item.id, {
                            "paymentFormTypeId": document.querySelector("#paymentFormTypeIdEdit").value,
                            "name": document.querySelector("#namePaymentFormDeliveryEdit").value
                        }).then(({message, status}) => {
                            SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                                if (status) location.reload();
                            })
                        }).finally(() => preload(false))
                    }
                })
            })
        });

        elementProperty.addEventInElement(".remove-payment-form-delivery", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja remover essa forma de pagamento", "", status => {
                const id = this.getAttribute("value");
                if (status) {
                    preload(true);
                    DeliveryPaymentFormController.delete(id).then(({status, message}) => {
                        SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                            if (status) location.reload()
                        })
                    }).finally(() => preload(false));
                }
            })
        });
    }).finally(() => {
        preload(false)
    });

    SettingsController.getTypePaymentForm().then(({response}) => {
        const list = response.map(item => {
            return `<option value="${item.id}">${item.description}</option>`
        }).join("");

        document.querySelector("#paymentFormTypeId").innerHTML = list;
        document.querySelector("#paymentFormTypeIdEdit").innerHTML = list;
    });

    elementProperty.addEventInElement("#btnAddPaymentFormDelivery", "onclick", function () {
        const data = {
            "paymentFormTypeId": document.querySelector("#paymentFormTypeId").value,
            "name": document.querySelector("#namePaymentFormDelivery").value
        };

        if (data.name.trim().length === 0 || data.name === "")
            return alert("Informe a descrição da forma de pagamento");

        preload(true);

        DeliveryPaymentFormController.insert(data).then(({status, message}) => {
            SwalCustom.messageDialog("", message, status ? "success" : "info").then(() => {
                if (status) location.reload()
            })
        }).finally(() => preload(false));
    });

    elementProperty.addEventInElement("#billingDate", 'onchange', setBillingDate);

    function list() {
        preload(true);
        EstablishmentCollectionManagementController.listCharges().then(({response}) => {
            const list = response.map(item => {
                return `
                <tr>
                    <td>${item.label}</td>
                    <td>${Mask.maskMoney(item.fixedValue)}</td>
                    <td>${Mask.maskMoney(item.orderValue)}</td>
                    <td>${Mask.maskMoney(item.orderPercentage)}</td>
                    <td>${Mask.setDateCrazy(item.created_at)}</td>
                    <td>
                    <button idCharge="${item.id}" type="button" class="btn btn-danger btn-sm btn-remove-charge"><span class="material-icons">
                            delete
                        </span></button>
                    </td>
                </tr>
            `
            }).join("");
            preload(false);

            document.querySelector('#listCharges').innerHTML = list;
            elementProperty.addEventInElement('.btn-remove-charge','onclick', removeCharge);
        });

        elementProperty.addEventInElement("#insertCharge", "onclick", addCharge);
    }

    function addCharge() {
        const name = document.querySelector('#nameCharge').value;
        const fixedValue = Mask.removeMaskMoney(document.querySelector('#fixedValueCharge').value);
        const orderValue = Mask.removeMaskMoney(document.querySelector('#orderValueCharge').value);
        const orderPercentage = Mask.removeMaskMoney(document.querySelector('#orderPercentageCharge').value);

        const data = {
            label: name,
            fixedValue,
            orderValue,
            orderPercentage
        }

        preload(true);
        EstablishmentCollectionManagementController.insertCharges(data).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Cobrança adicionada com sucesso!", "success").then(() => list());
        }).finally(() => {
            $('#addCharge').modal('hide');
        });
    }

    function removeCharge() {
        const id = this.getAttribute('idCharge');
        SwalCustom.confirm("Deseja confirmar a exclusão da cobrança?", "Essa ação é irreversivel!")
            .then(() => {
                preload(true);
                EstablishmentCollectionManagementController.deleteCharge(id).then(({status, response}) => {
                    preload(false);
                    if (!status)
                    return SwalCustom.messageDialog("", response[0], "error");
                    SwalCustom.messageDialog("", "Cobrança excluida com sucesso!", "success").then(() => list());
                });
            });
    }

    function setBillingDate() {
        const billingDate = document.querySelector('#billingDate').value;
        preload(true);
        EstablishmentCollectionManagementController.setBillingDate(billingDate).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Dia da cobrança atualizado com sucesso!", "success");
        });
    }

    function selectedBillingDate() {
        EstablishmentCollectionManagementController.selectedBillingDate().then((data) => {
            document.querySelector('#billingDate').value = data.response;
        });
    }
});