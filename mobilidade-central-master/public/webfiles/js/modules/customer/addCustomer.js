document.addEventListener("DOMContentLoaded", function () {
    Mask.setMaskCpf("#documentCustomer");
    Mask.setMaskPhone("#phoneCustomer");


    viewController.elementProperty
        .addEventInElement("#closeModalCreateCustomer", "onclick", closeModal);

    viewController.elementProperty
        .addEventInElement("#btnCancelModalCreateCustomer", "onclick", closeModal);

    viewController.elementProperty.addEventInElement("#isCompanyCustomerPf", "onclick", function () {     
        document.getElementById("descriptionName").innerHTML = "Nome do cliente";
        document.getElementById("descriptionDocument").innerHTML = "CPF";
        document.getElementById("descriptionDate").innerHTML = "Data de Nascimento";
        const isChecked = document.getElementById("register-international")?.checked;
        if (!isChecked) {
            Mask.setMaskCpf("#documentCustomer");
        }
    })

    viewController.elementProperty.addEventInElement("#isCompanyCustomerPj", "onclick", function () {
        document.getElementById("descriptionName").innerHTML = "Nome da empresa";
        document.getElementById("descriptionDocument").innerHTML = "CNPJ";
        document.getElementById("descriptionDate").innerHTML = "Data de incrição";
        const isChecked = document.getElementById("register-international")?.checked;
        if (!isChecked) {
            Mask.setMaskCnpj("#documentCustomer");
        }
    })

    viewController.elementProperty.addEventInElement("#register-international", "onchange", function () {
        const isChecked = document.getElementById("register-international")?.checked;
        if (isChecked) {
            Mask.removeMask("#documentCustomer");
            Mask.removeMask("#phoneCustomer");
        } else {
            document.getElementById("isCompanyCustomerPf").checked = true;
            document.getElementById("isCompanyCustomerPj").checked = false;
            document.getElementById("descriptionName").innerHTML = "Nome do cliente";
            document.getElementById("descriptionDocument").innerHTML = "CPF";
            document.getElementById("descriptionDate").innerHTML = "Data de Nascimento";
            Mask.setMaskCpf("#documentCustomer");
            Mask.setMaskPhone("#phoneCustomer");
        }
    });


    viewController.elementProperty.addEventInElement("#saveCustomer", "onclick", function () {
        if (!this.closest(".modal-create-customer")) {
            return;
        }

        let responseKeyAppPartnerParsed = null;
        try {
            const responseKeyAppPartner = localStorage.getItem("keyAppPartner");
            if (responseKeyAppPartner) {
                responseKeyAppPartnerParsed = JSON.parse(responseKeyAppPartner);
            }
        } catch (e) {
            responseKeyAppPartnerParsed = null;
        }

        const customer = {
            name: document.getElementById("nameCustomer").value,
            phone: document.getElementById("phoneCustomer").value,
            email: document.getElementById("emailCustomer")?.value?.trim() || "",
            document: document.getElementById("documentCustomer").value,
            dateOfBirth: document.getElementById("dateOfBirthCustomer").value,
            isCompany: document.getElementById("isCompanyCustomerPj").checked,
            key_app_partner: responseKeyAppPartnerParsed ?? null
        };

        if (customer.name.length === 0) {
            SwalCustom.messageDialog("", "Informe o nome do cliente", undefined, "info");
            return false;
        }

        const emailInput = document.getElementById("emailCustomer");
        if (emailInput) {
            if (customer.email.length === 0) {
                SwalCustom.messageDialog("", "Informe o e-mail do cliente", undefined, "info");
                return false;
            }
            if (!ValidateForm.validateEmail(customer.email)) {
                SwalCustom.messageDialog("", "E-mail do cliente inválido", undefined, "info");
                return false;
            }
        }

        const isChecked = document.getElementById("register-international")?.checked;

        if(customer.document.length > 0 && customer.isCompany === false){
            if (!ValidateForm.validateCpf(customer.document) && !isChecked) {
                SwalCustom.messageDialog("", "CPF inválido", undefined, "info");
                return false;
            }
        }

        if(customer.document.length > 0 && customer.isCompany){
            if (!ValidateForm.validateCnpj(customer.document) && !isChecked) {
                SwalCustom.messageDialog("", "CNPJ inválido", undefined, "info");
                return false;
            }
        }

        if (!ValidateForm.validatePhone(customer.phone) && !isChecked) {
            SwalCustom.messageDialog("", "Telefone do cliente inválido", undefined, "info");
            return false;
        }

        if (customer.dateOfBirth.length === 0) {
            SwalCustom.messageDialog("", "Informe a data de nascimento do cliente", undefined, "info");
            return false;
        }

        this.disabled = true;

        CentralRepository.insertCustomer(
            Session.getValueInSession("centralSelected", "id"), customer)
            .then(({status, response, message}) => {
                if (!status) {
                    if (response?.email) {
                        SwalCustom.messageDialog("", response.email[0]);
                        return;
                    }
                    if (response?.phone) {
                        SwalCustom.messageDialog("", response.phone[0]);
                        return;
                    }
                    if (response?.document) {
                        SwalCustom.messageDialog("", response.document[0]);
                        return;
                    }
                    SwalCustom.messageDialog("", message || "Não foi possível cadastrar o cliente", undefined, "warning");
                    return;
                }

                document.getElementById("nameCustomer").value = "";
                document.getElementById("phoneCustomer").value = "";
                emailInput && (emailInput.value = "");
                document.getElementById("documentCustomer").value = "";
                document.getElementById("dateOfBirthCustomer").value = "";

                viewController.elementProperty.removeClass(".modal-create-customer", "active");

                if (typeof getPlaceCustomer === 'function') {
                    if (typeof trip !== "undefined") {
                        trip.customer = response;
                    }
                    document.querySelector(".modal-find-customer")?.classList.remove("active");
                    getPlaceCustomer();
                } else {
                    window.location.href = '/customer/list';
                }
            }).catch(() => {
                SwalCustom.messageDialog("", "Não foi possível cadastrar o cliente. Verifique os dados e tente novamente.", undefined, "warning");
            }).finally(() => {
                this.disabled = false;
            });
    });

    function closeModal() {
        viewController.elementProperty.removeClass(".modal-create-customer", "active");
    }
});