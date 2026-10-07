ManagerView.PartnerView = {
    actionRequestPartnership: function () {
        const js = [
            "controllers/PartnerController",
            "modulos/partner/requestPartnership"
        ];
        const views = [
            "partner/requestPartnership"
        ];
        const css = [
            "partner/requestPartnership"
        ];

        viewController.nameView = "request-partnership";

        layoutBuild(views, js, css);
    }
};