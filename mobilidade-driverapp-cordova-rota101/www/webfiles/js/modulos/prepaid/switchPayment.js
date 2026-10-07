viewController.setObserver("prepaid-switch-payment", (prepaid) => {

    document.querySelector("#listPaymentPrepaid").innerHTML = prepaid.paymentForms.map(item => {
        return `<li class="option-payment-prepaid" value='${JSON.stringify(item)}'>${item.name}</li>`;
    }).join("");

    viewController.elementProperty.addEventInElement(".option-payment-prepaid", "onclick", function () {
        const paymentForm = JSON.parse(this.getAttribute("value"));

        if (paymentForm.automaticPayment == true) {
            viewController.addParams("prepaid-pay-credit-card", paymentForm);
            Route.redirectDynamic("Prepaid", "PayCreditCard");
        } else {
            viewController.addParams("prepaid-account-deposit", {prepaid,paymentForm});
            Route.redirectDynamic("Prepaid", "AccountDeposit");
        }
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });
});