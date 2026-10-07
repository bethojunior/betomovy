ManagerView.MainView = {
    actionLogin: function () {
        const js = [
            'controllers/AppController',
            'controllers/DriverController',
            'controllers/TermsUsePolicyController',
            'service/Push',
            'modulos/test/secret',
            'modulos/driver/login',
            'modulos/version/version',
        ];

        const css = [
            'menu',
            'login',
            'preload',
            'modal/updateVersion'
        ];

        const views = [
            'menu/menuTitle',
            'login/index',
            'preloader/index',
            'modal/updateVersion'
        ];

        layoutBuild(views, js, css);
    },
    actionIndex: function () {
        if (Session.get("user").idUser !== undefined) {
            Route.redirect("Driver")
        }
        const js = [
            'controllers/ConfigController',
            'controllers/TermsUsePolicyController',
            'modulos/menu/main'
        ];
        const css = ['main','preload'];
        const views = ['default/index', 'preloader/index'];
        layoutBuild(views, js, css);
    },
    actionSignup: function () {
        const js = [
            'controllers/DocUserTypeController',
            'controllers/DriverController',
            'controllers/EstateController',
            'controllers/CityController',
            'controllers/StationTypeController',
            'controllers/RequiredFieldController',
            'controllers/FormStepController',
            'controllers/StationController',
            'controllers/CooperativeController',
            'controllers/SupportController',
            'controllers/UserController',
            'controllers/UserTypeController',
            'controllers/UtilController',
            'controllers/MilitaryForceController',
            'controllers/DriverAttachmentTypeController',
            'service/Push',
            'service/MapService',
            'utils/FormGroup',
            'utils/FileUpload',
            'modulos/validator/validateSignup',
            'modulos/driver/signup'
        ];
        const css = [
            'menu',
            'signup',
            'preload',
            'modal/modalDocument'
        ];
        const views = [
            'menu/menuTitle',
            'driver/signup',
            'preloader/index',
            'modal/modalDocument'
        ];
        layoutBuild(views, js, css);
    },
    actionLincense: function () {
        const js = [
            'modulos/menu/menuTitle'
        ];
        const css = ['menu', 'signup'];
        const views = [
            'menu/menuTitle',
            'lincense/index',
        ];

        viewController.nameView = "menu-title";

        layoutBuild(views, js, css);
    },
    actionForgetPassword: function () {
        const js = [
            'modulos/driver/forgetPassword',
            'utils/preload'
        ];
        const css = [
            'driver/forgetPassword'
        ];
        const views = [
            'driver/forgetPassword',
            'preloader/index'
        ];

        viewController.nameView = "forget-password";
        layoutBuild(views, js, css);
    }
};
