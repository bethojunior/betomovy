<?php

namespace app\controllers;

use app\services\DocUserService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 11:39
 */
class DocUserController extends ApiController
{
    public function actionFind()
    {
        try {
            $result = (new DocUserService)
                ->find(Headers::getUserId());

            echo $this->returnSuccess("Documentos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar documentos do usuário");
        }
    }

    public function actionSend()
    {
        try {
            $result = (new DocUserService)
                ->send(Headers::getUserId(), $_POST, $_FILES);

            echo $this->returnSuccess("Documento enviado", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}