<?php


class NotesController extends View
{

    public function actionIndex()
    {
        $this->nameView = "Notas de atualização";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "notes/index"
            ],
            [
                "controllers/ReportController",
                "modulos/notes/index"
            ],
            [
                "notes/index",
                ""
            ]);
    }

}