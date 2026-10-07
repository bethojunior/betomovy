<?php

class ItemController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Inserir Itens";
        $this->layoutBuilder(
            [
                "menu/index",
                "item/index"
            ],
            [
                "controllers/MonitorController",
                "controllers/Cliente/ClienteController",
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/item/index",
            ],
            [
                "menu/index",
                "item/index"
            ]
        );
    }

    public function actionAccessibility()
    {
        $this->nameView = "Inserir Itens";
        $this->layoutBuilder(
            [
                "menu/index",
                "item/accessibility",
                "item/addHelper"
            ],
            [
                "controllers/MonitorController",
                "controllers/Cliente/ClienteController",
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/item/accessibility",
            ],
            [
                "menu/index",
                "item/accessibility"
            ]
        );
    }

    public function actionObstacles()
    {
        $this->nameView = "Obstáculos";
        $this->layoutBuilder(
            [
                "menu/index",
                "item/obstacles",
                "item/addObstacle",
            ],
            [
                "controllers/MonitorController",
                "controllers/Cliente/ClienteController",
                "controllers/SettingsController",
                "controllers/Item/ItemController",
                "modulos/menu/index",
                "modulos/item/obstacles",
            ],
            [
                "menu/index",
                "item/obstacles"
            ]
        );
    }

    public function actionList()
    {
        $this->nameView = "Listagem Itens";
        $this->layoutBuilder(
            [
                "menu/index",
                "item/list"
            ],
            [
                "controllers/MonitorController",
                "controllers/Cliente/ClienteController",
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/item/list",
            ],
            [
                "menu/index",
                "item/list"
            ]
        );
    }

    public function actionAccessibilityTrip()
    {
        $this->nameView = "Acessibilidade de viagem";
        $this->layoutBuilder(
            [
                "menu/index",
                "item/AccessibilityTrip"
            ],
            [
                "controllers/MonitorController",
                "controllers/Cliente/ClienteController",
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/item/AccessibilityTrip",
            ],
            [
                "menu/index",
                "item/AccessibilityTrip"
            ]
        );
    }

}
