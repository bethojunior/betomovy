ManagerView.MapView = {
    actionHeat: function () {
        const js = [
            'controllers/DynamicController',
            "service/MapService",
            "modulos/map/heat"
        ];
        const css = [
            "map/heat"
        ];
        const views = [
            "map/heat"
        ];

        viewController.nameView = "heat-map";

        layoutBuild(views, js, css);
    }
};
