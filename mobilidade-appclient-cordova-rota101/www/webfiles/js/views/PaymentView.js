ManagerView.PaymentView = {
    actionIndex: function(){
        const js = [
            'controllers/CustomerCardController',
            'modulos/payment/index'
        ];
        const css = [
            'card/add',
            'payment/index'
        ];
        const views = [
            'payment/index',
        ];

        viewController.nameView = "payment";

        layoutBuild(views, js, css);
    },
    actionBuyVoucher: function(){
        const js = [
            'controllers/VoucherPurchaseController',
            'modulos/payment/buyVoucher'
        ];
        const css = [
            'payment/buyVoucher'
        ];
        const views = [
            'preload/index',
            'payment/buyVoucher',
        ];

        viewController.nameView = "buy-voucher";

        layoutBuild(views, js, css);
    },
    actionPay: function(){
        const js = [
            'controllers/VoucherPurchaseController',
            'controllers/CustomerCardController',
            "modulos/payment/pay",
            "modulos/payment/cards",
            "service/PaymentCard"
        ];
        const css = [
            "payment/pay",
            "modal/cards",
            "payment/success"
        ];
        const views = [
            "preload/index",
            "payment/pay",
            "modal/cards",
            "payment/success",
        ];

        viewController.nameView = "pay";

        layoutBuild(views, js, css);
    },
    actionDetailCard: function(){
        const js = [
            'controllers/CustomerCardController',
            "modulos/card/detail"
        ];
        const css = [
            "card/detail"
        ];
        const views = [
            "preload/index",
            "card/detail"
        ];

        viewController.nameView = "detail-card";

        layoutBuild(views, js, css);
    }

};
