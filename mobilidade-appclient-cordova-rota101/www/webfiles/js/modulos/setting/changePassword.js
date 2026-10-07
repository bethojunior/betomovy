viewController.setObserver("change-password", function () {
    const elementProperty = new ElementProperty();

    const manager = {
        code: null,
        isByCode: false
    };

    elementProperty.addEventInElement("#btnConfirmationChangePassword", "onclick", function () {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmationPassword = document.getElementById("confirmationPassword").value;

        if (!validatePassword(newPassword, confirmationPassword))
            return;

        preload(true);

        if(manager.isByCode){
            changePassword(newPassword);
            return;
        }

        CustomerController.checkPassword(currentPassword).then(({status}) => {
            if (!status) {
                preload(false);
                SwalCustom.messageDialog("", "Senha atual inválida", undefined, "warning");
                return;
            }
            changePassword(newPassword)
        })
    });

    function changePassword(newPassword){
        CustomerController.updatePassword({
          password: newPassword,
          email: Session.getValueInSession("user", "email"),
          withoutCode: true,
        }).then(({ status }) => {
          preload(false);

          if (!status) {
            SwalCustom.messageDialog(
              "",
              "Ocorreu um error ao tentar atualizar senha",
              undefined,
              "warning"
            );
            return;
          }

          SwalCustom.messageDialog(
            "",
            "Senha atualizada com sucesso",
            clearFields,
            "success"
          );
        });
    }

    elementProperty.addEventInElement("#resetPasswordClient","onclick",function(){
            SwalCustom.dialogConfirm("Tem certeza que deseja criar nova senha ?",
                "Será enviado um código para seu numero cadastrado","warning")
                .then(sendSmsCode)
    });

    function sendSmsCode(){
        preload(true);
        CustomerController.
        ForgotPassword(Session.getValueInSession("user", "email"))
            .then(({status,data})=>{
                preload(false);
                if(!status){
                    SwalCustom.dialogConfirm("","Não foi possivel enviar o codigo, tente novamente",undefined,"warning");
                    return;
                }

                manager.code = parseInt(data.code);

                document.getElementById("containerChangePassword").style.display = "none";
                document.getElementById("containerConfirmationCodePassword").style.display = "block";
            });
    }

    function clearFields() {
        document.getElementById("currentPassword").hidden = false;
        document.getElementById("messageForgetPassword").style.display = "block";
        document.getElementById("containerChangePassword").style.display = "block";
        document.getElementById("containerConfirmationCodePassword").style.display = "none";
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmationPassword").value = "";
        manager.code = null;
        manager.isByCode = false;
    }


    function validatePassword(newPassword, confirmationPassword) {
        if (newPassword.length < 6) {
            SwalCustom.messageDialog("", "Atenção , a senha deve conter no minimo 6 caracteres !",
                undefined, "warning");
            return false;
        }
        if (newPassword !== confirmationPassword) {
            SwalCustom.messageDialog("", "Atenção , senha de confirmação não corresponde a senha",
                undefined, "warning");
            return false;
        }

        return true;
    }

    elementProperty.addEventInElement("#codeConfirmationPassword", "onkeyup", function () {
        if (this.value.length === 4) {
            validateCode(this.value)
        }
    });

    function validateCode(value) {
        if (manager.code === parseInt(value)) {
            showFormNewPassword();
            return;
        }
        SwalCustom.messageDialog("", "Codigo invalido", undefined, "warning");
        elementProperty.getElement("#codeConfirmationPassword", element => element.value = "");
    }

    function showFormNewPassword(){
        clearFields();
        document.getElementById("messageForgetPassword").style.display = "none";
        document.getElementById("currentPassword").hidden = true;
        manager.isByCode = true;
    }

    elementProperty.addEventInElement(".go-back", 'onclick', function () {
        Route.backPage();
    });

    viewController.onBack(clearFields);

    Route.pageDynamic();
});