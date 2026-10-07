ManagerView.AppView = {
    actionSetting: function () {
        const js = [
            "controllers/DriverFormOfPaymentController",
            "controllers/TripPaymentFormController",
            'modulos/setting/app'
        ];
        const css = [
            'menu-close',
            'menu',
            'setting/app',
        ];
        const views = [
            'menu/mainChat',
            'setting/app',
        ];

        viewController.nameView = "app-setting";

        layoutBuild(views, js, css);
    }
};
