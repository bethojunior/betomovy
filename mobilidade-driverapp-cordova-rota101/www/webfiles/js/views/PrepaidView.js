ManagerView.PrepaidView = {
    actionSwitchPayment: function () {
        const js = ["modulos/prepaid/switchPayment"];
        const css = ["prepaid/switchPayment"];
        const views = ["prepaid/switchPayment"];

        viewController.nameView = "prepaid-switch-payment";

        layoutBuild(views, js, css);
    },
    actionAccountDeposit: function () {
        const js = ["modulos/prepaid/anotherPayment"];
        const css = ["prepaid/accountDeposit"];
        const views = ["prepaid/accountDeposit"];

        viewController.nameView = "prepaid-account-deposit";

        layoutBuild(views, js, css);
    },
    actionPayCreditCard: function () {
        const js = [
            "controllers/CustomerCardController",
            "modulos/prepaid/creditCard"
        ];
        const css = ["prepaid/payCreditCard"];
        const views = ["prepaid/payCreditCard"];

        viewController.nameView = "prepaid-pay-credit-card";

        layoutBuild(views, js, css);
    }

};