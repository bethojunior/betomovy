document.addEventListener("DOMContentLoaded", function () {

    const docCust = document.getElementById("documentCustomer");
    if (docCust && docCust.type !== "hidden") {
        Mask.setMaskCpf("#documentCustomer");
    }
    Mask.setMaskPhone("#phoneCustomer");

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#isCompanyCustomerPf", "onclick", function () {
        const descName = document.getElementById("descriptionName");
        if (descName) descName.innerHTML = "Nome do cliente";
        const descDoc = document.getElementById("descriptionDocument");
        if (descDoc) descDoc.innerHTML = "CPF";
        const descDate = document.getElementById("descriptionDate");
        if (descDate) descDate.innerHTML = "Data de Nascimento";
        const docInput = document.getElementById("documentCustomer");
        if (docInput && docInput.type !== "hidden") {
            Mask.setMaskCpf("#documentCustomer");
        }
    });

    elementProperty.addEventInElement("#isCompanyCustomerPj", "onclick", function () {
        const descName = document.getElementById("descriptionName");
        if (descName) descName.innerHTML = "Nome da empresa";
        const descDoc = document.getElementById("descriptionDocument");
        if (descDoc) descDoc.innerHTML = "CNPJ";
        const descDate = document.getElementById("descriptionDate");
        if (descDate) descDate.innerHTML = "Data de inscrição";
        const docInput = document.getElementById("documentCustomer");
        if (docInput && docInput.type !== "hidden") {
            Mask.setMaskCnpj("#documentCustomer");
        }
    });

    elementProperty.addEventInElement("#saveCustomer", "onclick", function () {
        const customer = {
            name: document.getElementById("nameCustomer") ? document.getElementById("nameCustomer").value : "",
            phone: document.getElementById("phoneCustomer") ? document.getElementById("phoneCustomer").value : "",
            document: document.getElementById("documentCustomer") ? document.getElementById("documentCustomer").value.trim() : "",
            dateOfBirth: document.getElementById("dateOfBirthCustomer") ? document.getElementById("dateOfBirthCustomer").value : "",
            isCompany: document.getElementById("isCompanyCustomerPj") ? document.getElementById("isCompanyCustomerPj").checked : false,
        };

        const emailInput = document.getElementById("emailCustomer");
        if (emailInput && emailInput.value.trim().length > 0) {
            customer.email = emailInput.value.trim();
            if (!ValidateForm.validateEmail(customer.email)) {
                SwalCustom.messageDialog("", "E-mail inválido", undefined, "info");
                return;
            }
        }

        if (customer.name.length === 0) {
            SwalCustom.messageDialog("", "Informe o nome do cliente", undefined, "info");
            return;
        }

        if (customer.document.length > 0 && !customer.isCompany) {
            if (!ValidateForm.validateCpf(customer.document)) {
                SwalCustom.messageDialog("", "CPF inválido", undefined, "info");
                return;
            }
        }

        if (customer.document.length > 0 && customer.isCompany) {
            if (!ValidateForm.validateCnpj(customer.document)) {
                SwalCustom.messageDialog("", "CNPJ inválido", undefined, "info");
                return;
            }
        }

        if (!ValidateForm.validatePhone(customer.phone)) {
            SwalCustom.messageDialog("", "Telefone inválido", undefined, "info");
            return;
        }

        if (customer.dateOfBirth.length === 0) {
            SwalCustom.messageDialog("", "Informe a data de nascimento", undefined, "info");
            return;
        }

        this.disabled = true;

        CentralRepository.insertCustomer(
            Session.getValueInSession("centralSelected", "id"), customer)
            .then(({status, response}) => {
                if (!status) {
                    if (response) {
                        if (response.email) {
                            SwalCustom.messageDialog("", response.email[0]);
                            return;
                        }
                        if (response.phone) {
                            SwalCustom.messageDialog("", response.phone[0]);
                            return;
                        }
                        if (response.document) {
                            SwalCustom.messageDialog("", response.document[0]);
                            return;
                        }
                    }
                    SwalCustom.messageDialog("", "Erro ao cadastrar cliente. Por favor, tente novamente.", undefined, "error");
                    return;
                }

                SwalCustom.messageDialog("", "Cliente cadastrado com sucesso!", () => {
                    window.location.href = '/customer/list';
                }, "success");
            }).finally(() => {
            this.disabled = false;
        });
    });
});
