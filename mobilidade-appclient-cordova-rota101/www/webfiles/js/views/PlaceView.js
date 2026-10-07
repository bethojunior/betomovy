ManagerView.PlaceView = {
    actionAddLocal(){
        const js = [
            "controllers/CustomerPlaceController",
            "modulos/place/add",
            "utils/CityGoogleMaps"
        ];
        const css = [
            "place/add"
        ];
        const views = [
            "place/add",
            'preload/index',
        ];

        viewController.nameView = "add-place";

        layoutBuild(views, js, css);
    }
};