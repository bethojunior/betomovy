ManagerView.FinancialView = {
    actionAccount : function(){
        const js = [
            'controllers/BalanceController',
            'controllers/DriverController',
            'modulos/financial/account',
        ];
        const css = [
            'account',
            'modal/infoExtract',
            'modal/modalPaymentPix',
            'preload'
        ];
        const views = [
            'menu/menuAccount',
            'financial/account',
            'preloader/index',
            'modal/infoExtract',
            'modal/modalPaymentPix',
        ];

        viewController.nameView = "account";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionFilterExtract: function(){
        const js = [
            'controllers/DriverController',
            'controllers/BalanceController',
            'modulos/financial/filterExtract',
        ];
        const css = [
            'account',
        ];
        const views = [
            'menu/menuAccount',
            'financial/filterExtract',
        ];

        viewController.nameView = "filter-extract";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionExtractFinancial: function(){
        const js = ['modulos/financial/extract'];
        const css = ['account'];
        const views = ['financial/extract'];

        viewController.nameView = "extract-financial";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionFilter: function(){
        const js = [
            'controllers/BalanceController',
            'controllers/DriverController',
            'modulos/financial/filter',
        ];
        const css = [
            'account',
        ];
        const views = [
            'menu/menuAccount',
            'financial/filter',
        ];

        viewController.nameView = "account-filter";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionTransference: function(){
        const js = [
            'controllers/BalanceController',
            'controllers/BankController',
            'controllers/BankAccountController',
            'controllers/WithdrawController',
            'controllers/DriverController',
            'modulos/financial/transference',
            'modulos/financial/CreateAccount',
        ];
        const css = [
            'account',
            'account-bank',
            'preload'
        ];
        const views = [
            'financial/transference',
            'financial/receipt-transference',
            'financial/bank-account',
            'preloader/index'
        ];

        viewController.nameView = "transference";

        layoutBuild(views, js, css,viewController.nameView);
    }
};