viewController.setObserver("setting-option",()=>{
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".go-back", 'onclick', function () {
        Route.backPage();
    });

    elementProperty.addEventInElement("#logoutSetting", 'onclick', function () {
        localStorage.clear();
        Route.redirect("Main", "Login");
    });


    if (ConfigGeneral().get("enable_account_deletion_request") == true) {
        document.getElementById("btnConfirmationRemoveAccountRequest").style.display = "none";
        document.getElementById("linkRemoveAccountRequest").style.display = "block";
    } else {
        document.getElementById("btnConfirmationRemoveAccountRequest").style.display = "block";
        document.getElementById("linkRemoveAccountRequest").style.display = "none";
    }

    elementProperty.addEventInElement("#btnConfirmationRemoveAccountRequest", "onclick", function () {

        const data = {
            reason: "-",
            details: "-"
        };

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

    verifyConfigApp();

    Route.pageDynamic();
});
