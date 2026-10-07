ManagerView.SettingView = {
    actionOption: function () {
        const js = [
            "modulos/setting/option"
        ];
        const css = [
            "setting/option"
        ];
        const views = [
            "setting/option"
        ];

        viewController.nameView = "setting-option";

        layoutBuild(views, js, css);
    },
    actionChangePassword: function(){
        const js = [
            "modulos/setting/changePassword"
        ];
        const css = [
            "setting/changePassword"
        ];
        const views = [
            'preload/index',
            "setting/changePassword"
        ];

        viewController.nameView = "change-password";

        layoutBuild(views, js, css);
    },
    actionRemoveAccountRequest: function(){
        const js = [
            "modulos/setting/removeAccountRequest"
        ];
        const css = [
            "setting/removeAccountRequest"
        ];
        const views = [
            'preload/index',
            "setting/removeAccountRequest"
        ];

        viewController.nameView = "remove-account-request";

        layoutBuild(views, js, css);
    }
};