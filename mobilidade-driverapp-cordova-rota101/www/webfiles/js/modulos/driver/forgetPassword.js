viewController.setObserver("forget-password", () => {
    const elementProperty = new ElementProperty();

    clearForm();

    const manager = {
        email: null,
        code: null
    };

    const validation = {
        email: false,
        confirmationSMS: false,
        password: false
    };

    elementProperty.addEventInElement("#goBackLogin", "onclick", function () {
        Route.backPage();
    });

    elementProperty.addEventInElement(".next-step", "onclick", function () {
        if (!validation.email) {
            verifyEmail();
            return;
        }

        if (!validation.confirmationSMS) {
            verifyCodeConfirmation();
            return;
        }

        if (!validation.password)
            verifyPassword();
    });

    function verifyEmail() {
        manager.email = document.getElementById("emailForget").value;

        if (!ValidateForm.validateEmail(manager.email)) {
            Materialize.toast(getTextTranslate("forget-password", "email-invalid"), 4000);
            return;
        }

        preloadGlobal(true);

        DriverController.getCodeVerify(manager.email).then(result => {
            if (result.status) {
                validation.email = true;
                manager.code = result.data.sms;
                nextStep();
                return;
            }
            Materialize.toast(getTextTranslate("forget-password", "error-request-code"), 5000);
        }).finally(() => preloadGlobal(false));
    }

    function nextStep() {
        if (!validation.email)
            return;

        elementProperty.removeClass(".steps-form", "active");

        if (!validation.confirmationSMS) {
            elementProperty.addClass("#stepConfirmationCode", "active");
            return;
        }

        if (!validation.password) {
            elementProperty.addClass("#stepNewPassword", "active");
            return;
        }
    }

    function clearForm() {
        elementProperty.removeClass(".steps-form", "active");
        elementProperty.addClass("#stepEmail", "active");
        document.getElementById("emailForget").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmationPassword").value = "";
        document.getElementById("codeVerifyPassword").value = "";
    }

    function verifyCodeConfirmation() {
        if (manager.code != document.getElementById("codeVerifyPassword").value) {
            Materialize.toast(getTextTranslate("forget-password", "code-invalid"), 5000);
            return;
        }

        validation.confirmationSMS = true;
        nextStep();
    }

    function verifyPassword() {

        let password = document.getElementById("newPassword").value;
        let confirmationPassword = document.getElementById("confirmationPassword").value;

        if (password.length < 5) {
            return Materialize.toast(getTextTranslate("forget-password", "password-length-error"), 5000);
        }

        if (password !== confirmationPassword) {
            Materialize.toast(getTextTranslate("forget-password", "error-confirm-password"), 5000);
            return;
        }

        preloadGlobal(true);

        DriverController.updatePasswordById(manager.email, password).then(result => {
            if (result.status) {
                Materialize.toast(getTextTranslate("forget-password", "update-password-success"), 5000);
                Route.backPage();
                return;
            }
            Materialize.toast(getTextTranslate("forget-password", "update-password-error"));
        }).finally(() => preloadGlobal(false));

    }

});
