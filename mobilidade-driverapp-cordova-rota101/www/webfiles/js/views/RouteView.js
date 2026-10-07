ManagerView.RouteView = {
    actionIndex: () => {
        const views = [
            "routes/index",
            "routes/details",
        ];
        const js = [
            "controllers/RouteController",
            "controllers/RideController",
            "controllers/DriverRideController",
            "modulos/route/index",
            "modulos/route/offer",
            "modulos/travel/details",
        ];
        const css = [
            "routes/index"
        ];

        viewController.nameView = "routes-index";

        layoutBuild(views, js, css);
    },
    actionCorporate: () => {
        const views = [
            "corporate/index"
        ];
        const js = [
            "controllers/ScheduleCorporateRouteController",
            "modulos/corporate/index"
        ];
        const css = [
            "corporate/index"
        ];

        viewController.nameView = "corporate-route";

        layoutBuild(views, js, css);
    },
    actionAddScheduleCorporate:()=>{
        const views = [
            "corporate/add"
        ];
        const js = [
            "controllers/ScheduleCorporateRouteController",
            "modulos/corporate/add"
        ];
        const css = [
            "corporate/add"
        ];

        viewController.nameView = "add-corporate-route";

        layoutBuild(views, js, css);
    }
};
