<?php

class RouteController extends View{
    public function actionRoute()
    {
        $this->nameView = "Cadastro de rota";
        $this->layoutBuilder(
            [

                "menu/index",
                "route/route",
            ],
            [
                "controllers/SettingsController",
                "controllers/Route/Controller",
                "controllers/TripTypeController",
                "service/MapService",
                "modulos/menu/index",
                "modulos/route/route",
            ],
            [
                "menu/index",
                "route/route",
            ]
        );
    }

    public function actionRouteList()
    {
        $this->nameView = "Listagem de rota";
        $this->layoutBuilder(
            [

                "menu/index",
                "route/routeList",
            ],
            [
                "controllers/SettingsController",
                "controllers/CorporateRouteController",
                "controllers/Route/Controller",
                "modulos/menu/index",
                "modulos/route/routeList",
            ],
            [
                "menu/index",
                "route/routeList",
            ]
        );
    }

    public function actionRouteEdit()
    {
        $this->nameView = "Editar rota";
        $this->layoutBuilder(
            [

                "menu/index",
                "route/routeEdit",
            ],
            [
                "controllers/SettingsController",
                "controllers/Route/Controller",
                "controllers/TripTypeController",
                "service/MapService",
                "modulos/menu/index",
                "modulos/route/routeEdit",
            ],
            [
                "menu/index",
                "route/routeEdit",
            ]
        );
    }

    public function actionReleaseDrivers()
    {
        $this->nameView = "Liberar motoristas";
        $this->layoutBuilder(
            [

                "menu/index",
                "route/releaseDrivers",
            ],
            [
                "controllers/SettingsController",
                "controllers/Route/Controller",
                "modulos/menu/index",
                "modulos/route/releaseDrivers",
            ],
            [
                "menu/index",
                "route/releaseDrivers",
            ]
        );
    }

    public function actionPromotionalBanner()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Banners";
        $this->layoutBuilder(
            [
                "route/promotionalBanner"
            ],
            [
                "controllers/RoutePromotionalBannerController",
                "modulos/route/promotionalBanner"
            ],
            [
                "route/promotionalBanner"
            ]
        );
    }
}