<?php

namespace app\controllers;
use app\services\AppSharingService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/01/2019
 * Time: 11:27
 */
class AppSharingController extends ApiController
{
    public function actionInsert()
    {
        try {
            $result = (new AppSharingService)
                ->insert($this->request(false));

            echo $this->returnSuccess("Compartilhamento de app inserido",
                $result
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir informação");
        }
    }
}