ManagerView.NotificationView = {
    actionIndex: ()=>{
        const js = ["modulos/notification/index"];
        const css = ["notification/index"];
        const views = ["notification/index"];

        viewController.nameView = "notification-detail";

        layoutBuild(views, js, css);
    }
};
