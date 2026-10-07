<?php


class MapSettingController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Configurações dos serviços de mapa";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ['maps/mapSettingInfo'],
            [
                "controllers/MapSettingController",
                "modulos/maps/mapSettingInfo"
            ]
        );
    }

    public function actionConfigMaps()
    {
        $this->nameView = "Configurações de mapas";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ['maps/configMaps'],
            [
                "controllers/MapSettingController",
                "modulos/maps/mapSetting"
            ]
        );
    }

    public function actionTest()
    {
        $this->nameView = "Teste de serviços de mapa";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ['maps/test'],
            [
                "controllers/MapSettingController",
                "modulos/maps/test"
            ]
        );
    }

    public function actionHeatMap()
    {
        $this->nameView = "Área de calor no mapa";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "maps/heatMap"
            ],
            [
                "service/MapService",
                "modulos/maps/heatMap"
            ],
            [
                "maps/heatMap"
            ]
        );
    }

    public function actionConfigByCity()
    {
        $this->nameView = "Configurações de credenciais por cidade";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "maps/configByCity"
            ],
            [
                "controllers/MapServiceController",
                "modulos/maps/configByCity"
            ]
        );
    }

    public function actionRouteOptimization()
    {
        $this->nameView = "Otimização de rota";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder([
            "maps/routeOptimization"
        ], [
            "controllers/MapSettingController",
            "modulos/maps/routeOptimization"
        ]);
    }

    public function actionKeys()
    {
        $this->nameView = "Gerenciamento de chaves de mapa web";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder([
            "maps/keys"
        ], [
            "controllers/WebMapKeyController",
            "modulos/maps/keys"
        ]);
    }
}
