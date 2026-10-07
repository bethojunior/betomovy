document.addEventListener("DOMContentLoaded", function () {

    Mask.setMaskCpf("#documentCustomer");
    Mask.setMaskPhone("#phoneCustomer");

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#isCompanyCustomerPf", "onclick", function () {
        document.getElementById("descriptionName").innerHTML = "Nome do cliente";
        document.getElementById("descriptionDocument").innerHTML = "CPF";
        document.getElementById("descriptionDate").innerHTML = "Data de Nascimento";
        Mask.setMaskCpf("#documentCustomer");
    });

    elementProperty.addEventInElement("#isCompanyCustomerPj", "onclick", function () {
        document.getElementById("descriptionName").innerHTML = "Nome da empresa";
        document.getElementById("descriptionDocument").innerHTML = "CNPJ";
        document.getElementById("descriptionDate").innerHTML = "Data de inscrição";
        Mask.setMaskCnpj("#documentCustomer");
    });

    elementProperty.addEventInElement("#saveCustomer", "onclick", function () {
        const customer = {
            name: document.getElementById("nameCustomer").value,
            phone: document.getElementById("phoneCustomer").value,
            email: document.getElementById("emailCustomer").value,
            document: document.getElementById("documentCustomer").value,
            dateOfBirth: document.getElementById("dateOfBirthCustomer").value,
            isCompany: document.getElementById("isCompanyCustomerPj").checked,
        };

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
