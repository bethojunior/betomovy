document.addEventListener("DOMContentLoaded", function () {

    const customerId = location.pathname.split("/")[2];

    const getElement = (id) => document.getElementById(id);

    // Aplicar máscaras nos valores já existentes (pré-preenchidos pelo PHP)
    const isCompany = getElement("isCompanyCustomerPj")?.checked;
    if (isCompany) {
        Mask.setMaskCnpj("#documentCustomer");
    } else {
        Mask.setMaskCpf("#documentCustomer");
    }

    viewController.elementProperty.addEventInElement("#isCompanyCustomerPf", "onclick", function () {
        getElement("descriptionName").innerHTML     = "Nome do cliente";
        getElement("descriptionDocument").innerHTML = "CPF";
        getElement("descriptionDate").innerHTML     = "Data de nascimento";
        Mask.setMaskCpf("#documentCustomer");
    });

    viewController.elementProperty.addEventInElement("#isCompanyCustomerPj", "onclick", function () {
        getElement("descriptionName").innerHTML     = "Nome da empresa";
        getElement("descriptionDocument").innerHTML = "CNPJ";
        getElement("descriptionDate").innerHTML     = "Data de inscrição";
        Mask.setMaskCnpj("#documentCustomer");
    });

    viewController.elementProperty.addEventInElement("#saveCustomer", "onclick", function () {
        const customer = {
            name:        getElement("nameCustomer").value,
            phone:       getElement("phoneCustomer").value,
            document:    getElement("documentCustomer").value,
            dateOfBirth: getElement("dateOfBirthCustomer").value,
            isCompany:   getElement("isCompanyCustomerPj").checked,
        };

        if (!customer.name.trim()) {
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
            SwalCustom.messageDialog("", "Telefone do cliente inválido", undefined, "info");
            return;
        }

        if (!customer.dateOfBirth) {
            SwalCustom.messageDialog("", "Informe a data de nascimento do cliente", undefined, "info");
            return;
        }

        this.disabled = true;
        const btn = this;

        CentralRepository.updateCustomer(
            Session.getValueInSession("centralSelected", "id"),
            customerId,
            customer
        ).then(function ({ status, response, message }) {
            if (!status) {
                const msg = response?.phone?.[0] || response?.document?.[0] || "Erro ao salvar cliente";
                SwalCustom.messageDialog("", msg, undefined, "info");
                return;
            }
            SwalCustom.messageDialog("", message, function () {
                location.href = '/customer/list';
            }, "success");
        }).catch(function () {
            SwalCustom.messageDialog("", "Erro ao salvar cliente", undefined, "error");
        }).finally(function () {
            btn.disabled = false;
        });
    });
});
