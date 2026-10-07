<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 20/02/2019
 * Time: 14:38
 */

class SupportController extends View
{
    public function actionIndex(){
        $this->nameView = "Suporte";
        $this->layoutBuilder(
            [
                "menu/index",
                "support/index"
            ],
            [
                "controllers/FinancialController",
                "modulos/menu/index",
                "modulos/support/index",
            ],
            [
                "menu/index",
                "support/index"
            ]
        );
    }
    public function actionCall(){
        $this->nameView = "Suporte / Abrir chamado";
        $this->layoutBuilder(
            [
                "menu/index",
                "support/call"
            ],
            [
                "controllers/FinancialController",
                "modulos/menu/index",
                "modulos/support/call",
            ],
            [
                "menu/index",
                "support/call"
            ]
        );
    }

    public function actionGet()
    {
        return $this->addEvents([
            'resetvariables' => 'resetvariables',
            'resetVariables' => 'resetvariables',
            'ResetVariables' => 'resetvariables',
        ]);
    }

    // Função para uso interno no suporte
    public function resetVariables($key)
    {
        if ($key === (new DateTime('now', new DateTimeZone('America/Fortaleza')))->format('Ymd') . '704') {
            $this->deleteGeneratedHostFiles();
            echo 'Arquivos gerados removidos com sucesso!';
        } else {
            echo 'Chave inválida';
        }
    }

}