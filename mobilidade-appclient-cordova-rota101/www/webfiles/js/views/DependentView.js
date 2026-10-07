ManagerView.DependentView = {
    actionList: function () {
        const js = [
            "controllers/DependentUser",
            "modulos/dependent/index"
        ];
        const css = ["dependent/index"];
        const views = ["dependent/index"];

        viewController.nameView = "list-dependent";

        layoutBuild(views, js, css);
    }
};
