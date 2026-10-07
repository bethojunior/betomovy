document.addEventListener("DOMContentLoaded", () => {
    const elementProperty = new ElementProperty();

    Mask.setMaskPhone("#phone");
    $('#document').mask('000.000.000-00', {reverse: true});

    elementProperty.addEventInElement(".add-user-admin", "onclick", () => {
        elementProperty.addClass(".container-modal-add-admin", "active");
    });

    RulesController.actionGetAll().then(({response}) => {
        document.querySelector("#typeProfile").innerHTML =
            response.map(item => {
                return `<option value="${item.id}">${item.name}</option>`;
            }).join("")
    });

    elementProperty.addEventInElement(".close-modal-add-admin", "onclick", closeModal);

    function closeModal() {
        elementProperty.removeClass(".container-modal-add-admin", "active");
        elementProperty.getElement(".form-input-admin", element => {
            element.value = "";
        })
    }

    elementProperty.addEventInElement("#formAdmin", "onsubmit", (e) => {
        e.preventDefault();

        const admin = {};

        elementProperty.getElement(".form-input-admin", element => {
            admin[element.getAttribute("id")] = element.value;
        });

        if (!ValidateForm.validateCpf(admin.document)) {
            SwalCustom.messageDialog("", "Cpf inválido", "info");
            return false;
        }

        if (admin.password !== admin.confirmationPassword) {
            SwalCustom.messageDialog("", "senha não confere", "info");
            return false;
        }

        admin.roleId = document.querySelector("#typeProfile").value;

        document.getElementById("btnAddAdmin").disabled = true;

        AdminController.post(admin)
            .then(({message, paramError}) => {
                document.getElementById("btnAddAdmin").disabled = false;
                if (paramError) {
                    SwalCustom.messageDialog(message, '', "info");
                    return;
                }
                SwalCustom.messageDialog("", "Administrado cadastrado com sucesso !", "success")
                    .then(closeModal);

                listAdmins();
            })
            .catch((response) => {
                document.getElementById("btnAddAdmin").disabled = false;
                if (response.paramError) {
                    SwalCustom.messageDialog(response.message, '', "info");
                    return;
                }

                SwalCustom.messageDialog('Tente novamente mais tarde', 'Erro interno no servidor', "info");
            });
    });
});