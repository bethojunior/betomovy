ManagerView.DriverView =  {
    actionFavorites : function(){
        const js = [
            "controllers/DriverController",
            "controllers/FavoriteDriverController",
            "modulos/driver/favorite"
        ];
        const css = [
            "driver/favorites",
            "driver/modalAddFavorite"
            ];
        const views = [
            'preload/index',
            "driver/favorites",
            "driver/addDriverFavorite",
            "driver/confirmationDriverFavorite"
        ];

        viewController.nameView = "list-favorites-driver";

        layoutBuild(views, js, css);
    }
};