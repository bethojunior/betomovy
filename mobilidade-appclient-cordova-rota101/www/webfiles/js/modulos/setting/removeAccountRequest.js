viewController.setObserver("remove-account-request", function () {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".go-back", 'onclick', function () {
        Route.backPage();
    });

    elementProperty.addEventInElement("#btnConfirmateRemoveAccountRequest", "onclick", function () {
        const reason = document.getElementById("reason").value;
        const details = document.getElementById("details").value;

        const data = {
            reason,
            details
        };

        if (data.reason == "" || data.details == "") {
            SwalCustom.messageDialog(
                `${getTextTranslate("removeAccountRequest", "attention-description-fields")}`,
                `${getTextTranslate("removeAccountRequest", "attention-title-fields")}`,
                () => {}, 'info');
            return;
        }

        if (data.reason.length < 3 || data.details.length < 3) {
            SwalCustom.messageDialog(
                `${getTextTranslate("removeAccountRequest", "attention-description-fields-length")}`,
                `${getTextTranslate("removeAccountRequest", "attention-title-fields")}`,
                () => {}, 'info');
            return;
        }

        removeAccountRequest(data);
    })

    function removeAccountRequest(data) {
        SwalCustom.dialogConfirm("", `${getTextTranslate("removeAccountRequest", "text-alert")}`)
            .then(() => {
                preload(true);

                CustomerController.removeAccountRequest(data).then((response) => {
                    if (response.status == false) {
                        SwalCustom.messageDialog("", `${getTextTranslate("removeAccountRequest", "text-alert-error-remove")}`, "error");
                        preload(false);
                        return;
                    }

                    SwalCustom.messageDialog("Sucesso", `${getTextTranslate("removeAccountRequest", "text-alert-success-remove")}`, "success")

                    setTimeout(() => {
                        Route.redirect("Main", "Login")
                    }
                    , 3000); 
                })
                .catch(() => { 
                    preload(false);
                })
        })
        .catch(() => {
            preload(false);
        });
    };

    function clearFields() {
        document.getElementById("reason").value = "";
        document.getElementById("details").value = "";
    }

    viewController.onBack(clearFields);

    Route.pageDynamic();

});
