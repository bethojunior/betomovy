viewController.setObserver("prepaid-account-deposit", ({prepaid, paymentForm}) => {
    // Sanitiza o conteúdo antes de inserir no DOM
    const sanitizedContent = prepaid.accountInformation ? prepaid.accountInformation.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    document.querySelector("#accountInformationPrepaid").textContent = sanitizedContent;

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnAnotherAccountDeposit", "onclick", function () {
        preload(true);
        PrepaidController
            .purchase({
                "creditPrepaidId": paymentForm.creditPrepaidId,
                "paymentFormId": paymentForm.paymentFormId,
                "cardId": null,
                "mpToken": null
            })
            .then(({status}) => {
                if (!status)
                    return SwalCustom.messageDialog("", "Não foi possível fazer a solicitação", undefined, "warning");

                SwalCustom.messageDialog(
                    "Esperando a confirmação de pagamento para libera o pré-pago",
                    "Solicitação de pré-pago feita com sucesso", undefined, "success");
                Route.backPage();
                Route.backPage();
            })
            .catch((error) => {
                console.error('Erro na solicitação do pré-pago:', error);
                SwalCustom.messageDialog("", i18n.t("prepaid.error-communication"), undefined, "error");
            })
            .finally(() => {
                preload(false)
            })
    });

    function preload(status) {
        if (status) {
            window.plugins.spinnerDialog.show();
        } else {
            window.plugins.spinnerDialog.hide();
        }
    }
});