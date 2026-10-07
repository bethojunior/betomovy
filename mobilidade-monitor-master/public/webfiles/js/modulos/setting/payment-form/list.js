updateListPaymentForm();

function updateListPaymentForm() {
    preload(true);
    SettingsController.getPaymentForms().then((data) => {
            document.querySelector('#listPaymentForm').innerHTML = data.response.map(item => {
                return `<tr>
                        <th scope="row">${item.name}</th>
                        <th scope="row">${item.payment_form_type.description}</th>
                        <td>
                            <a href="#" class="remove-payment-form" idPayment="${item.idTripPaymentForm}"><i class="material-icons">delete</i></a>
                        </td>
                        <td>
                            <a href="#" class="edit-payment-form" editPayment='${JSON.stringify(item)}'><i class="material-icons">edit</i></a>
                         </td>
                    </tr>`
            }).join("");

            elementProperty.addEventInElement(".remove-payment-form", "onclick", function (event) {
                SwalCustom.dialogConfirm("Deseja remover essa forma de pagamento?", "", status => {
                    if (!status)
                        return;

                    deletePaymentForm(this.getAttribute("idPayment"));
                })
            });

            elementProperty.addEventInElement(".edit-payment-form", "onclick", function () {
                $('#editPaymentFormModal').modal('show');
                const paymentForm = JSON.parse(this.getAttribute("editPayment"));

                document.querySelector('#idPaymentFormEdit').value = paymentForm.idTripPaymentForm;
                document.querySelector('#descriptionPaymentFormEdit').value = paymentForm.name;
                document.querySelector('#typePaymentFormEdit').value = paymentForm.payment_form_type.id;

            })


            function deletePaymentForm(id) {
                preload(true);
                SettingsController.deletePaymentForm(id).then(data => {
                    if (data.status) {
                        updateListPaymentForm()
                        SwalCustom.messageDialog("", data.message, data.status ? "success" : "info")
                    }
                }).finally(() => {
                    preload(false);
                });
            }


            function updatePaymentForm() {
                let id = document.querySelector("#idPaymentFormEdit").value;
                let descriptionPaymentFormEdit = document.querySelector('#descriptionPaymentFormEdit').value;
                let typePaymentFormEdit = document.querySelector('#typePaymentFormEdit').value;

                if (descriptionPaymentFormEdit.length <= 0)
                    return alert("Informe a descrição da forma de pagamento!");

                if (typePaymentFormEdit == "")
                    return alert("Selecione o tipo de forma de pagamento!");

                $('#editPaymentFormModal').modal('hide');

                preload(true);
                SettingsController.updatePaymentForm(id, descriptionPaymentFormEdit, typePaymentFormEdit).then((data) => {
                    document.querySelector('#descriptionPaymentFormEdit').value = "";
                    document.querySelector('#typePaymentFormEdit').value = "";

                    SwalCustom.messageDialog("", data.message, data.status ? "success" : "info");
                    updateListPaymentForm();
                }).finally(() => {
                    preload(false);
                })

            }

            elementProperty.addEventInElement('#editPaymentForm', 'onclick', updatePaymentForm);
        }
    ).finally(() => {
        preload(false);
    });
}