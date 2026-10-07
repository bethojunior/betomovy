ManagerView.EstablishmentView = {
    actionFilter: function () {
        const js = [
            'controllers/CityController',
            'controllers/NeighborhoodController',
            'controllers/EstablishmentController',
            'controllers/ClientController',
            'modulos/menu/menu',
            'modulos/establishment/filterEstablishment',
            'utils/preload'
        ];
        const css = [
            'menu-close',
            'menu',
            'establishmentFilter',
            'menuEstablishment',
            'preload'

        ];
        const views = [
            'menu/mainChat',
            'establishment/filter',
            'preloader/index'
        ];
        layoutBuild(views, js, css);
    }
}