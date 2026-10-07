ManagerView.FinancialView = {
    actionAccount : function(){
        const js = [
            'controllers/BalanceController',
            'controllers/PartnerBalanceController',
            'controllers/DriverController',
            'modulos/financial/account',
        ];
        const css = [
            'financial/account',
            'modal/infoExtract',
        ];
        const views = [
            'menu/menuAccount',
            'financial/account',
            'modal/infoExtract',
            "preload/index",
        ];

        viewController.nameView = "account";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionFilterExtract: function(){
        const js = [
            'controllers/DriverController',
            'controllers/PartnerBalanceController',
            'modulos/financial/filterExtract',
        ];
        const css = [
            'financial/account',
        ];
        const views = [
            'menu/menuAccount',
            'financial/filterExtract',
            "preload/index",
        ];

        viewController.nameView = "filter-extract";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionExtractFinancial: function(){
        const js = ['modulos/financial/extract'];
        const css = ['financial/account'];
        const views = ['financial/extract', "preload/index",];

        viewController.nameView = "extract-financial";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionFilter: function(){
        const js = [
            'controllers/PartnerBalanceController',
            'controllers/DriverController',
            'modulos/financial/filter',
        ];
        const css = [
            'financial/account',
        ];
        const views = [
            'menu/menuAccount',
            'financial/filter',
            "preload/index",
        ];

        viewController.nameView = "account-filter";

        layoutBuild(views, js, css,viewController.nameView);
    },
    actionTransference: function(){
        const js = [
            'controllers/PartnerBalanceController',
            'controllers/BankController',
            'controllers/BankAccountController',
            'controllers/WithdrawController',
            'controllers/DriverController',
            'modulos/financial/transference',
            'modulos/financial/CreateAccount',
        ];
        const css = [
            'financial/account',
            'financial/account-bank',
        ];
        const views = [
            'financial/transference',
            'financial/receipt-transference',
            'financial/bank-account',
            "preload/index",
        ];

        viewController.nameView = "transference";

        layoutBuild(views, js, css,viewController.nameView);
    }
};