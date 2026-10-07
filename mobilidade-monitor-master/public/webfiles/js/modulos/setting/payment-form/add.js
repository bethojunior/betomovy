function addPaymentForm() {
    let descriptionPaymentForm = document.querySelector('#descriptionPaymentForm').value;
    let typePaymentForm = document.querySelector('#typePaymentForm').value;

    if (descriptionPaymentForm.length <= 0)
        return alert("Informe a descrição da forma de pagamento!");

    if (typePaymentForm == "")
        return alert("Selecione o tipo de forma de pagamento!");

    $('#addPaymentFormModal').modal('hide');

    preload(true);
    SettingsController.insertPaymentForm(descriptionPaymentForm, typePaymentForm).then((data) => {
        document.querySelector('#descriptionPaymentForm').value = "";
        document.querySelector('#typePaymentForm').value = "";

        SwalCustom.messageDialog("", data.message, data.status ? "success" : "info");
        updateListPaymentForm();
    }).finally(() => {
        preload(false);
    })

}

elementProperty.addEventInElement('#addPaymentForm', 'onclick', addPaymentForm)

SettingsController.getTypePaymentForm().then((data) => {
    const options = data.response.map(item => {
        return `
                <option value="${item.id}">${item.description}</option>
           `
    }).join("");

    document.querySelector('#typePaymentForm').innerHTML += options;
    document.querySelector('#typePaymentFormEdit').innerHTML += options;
}).finally(() => {
})