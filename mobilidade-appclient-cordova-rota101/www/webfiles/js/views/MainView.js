ManagerView.MainView = {
    actionLogin: function () {
        const js = [
            "utils/Handle",
            "utils/preload",
            "controllers/CityController",
            "controllers/CustomerController",
            "controllers/TermsUsePolicyController",
            "controllers/UserController",
            "controllers/AppController",
            "modulos/update/version",
            "modulos/login/login",
            "modulos/permission/index",
        ];
        const views = [
            'preload/index',
            'login/index',
            'modal/updateVersion'
        ];
        const css = [
            "login",
            'modal/updateVersion'
        ];

        viewController.nameView = "login";

        layoutBuild(views, js, css);
    },
    actionAutoLogin: function () {
        const js = [
            "controllers/CustomerController",
            "modulos/client/autoLogin"
        ];
        const views = [
            "splash/index",
        ];
        const css = [
            "splash/index",];

        viewController.nameView = "autoLogin";

        layoutBuild(views,js,css);
    },
    actionSignup: function () {
        const js = [
            "controllers/DocUserTypeController",
            "controllers/CustomerController",
            "controllers/MilitaryForceController",
            "controllers/RequiredFieldController",
            "modulos/client/register",
            "utils/validate"
        ];
        const css = [
            'customer/signup',
            'modal/modalCode'

        ];
        const views = [
            'preload/index',
            'customer/register',
            'modal/confirmationCode'
        ];

        viewController.nameView = "signup";

        layoutBuild(views, js, css);
    },
    actionLincense: function () {
        const js = [];
        const css = ['menu', 'signup'];
        const views = [
            'menu/menuTitle',
            'lincense/index',
        ];
        layoutBuild(views, js, css);
    },
    actionForgetPassword: function () {
        const js = [
            "utils/preload",
            "controllers/CustomerController",
            "controllers/UserController",
            "modulos/login/forgetPassword"
        ];
        const css = ['forgetPassword', 'preload'];
        const views = [
            'preload/index',
            'login/forgetPassword',
        ];

        viewController.nameView = "forgetPassword";

        layoutBuild(views, js, css);
    }
};
