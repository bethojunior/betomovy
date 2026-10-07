<?php


class SimpleDeliveryController extends View
{
    public function actionItems()
    {
        $this->nameView = "Itens de entrega simples";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ["simple-delivery/items"],
            [
                "controllers/SettingsController",
                "modulos/simple-delivery/items"
            ]
        );
    }

    public function actionSuggestionText()
    {
        $this->nameView = "Sugestão de texto";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ["simple-delivery/suggestion-text"],
            [
                "controllers/SettingsController",
                "modulos/simple-delivery/suggestion-text"
            ]
        );
    }
}