<?php

namespace app\controllers;

use app\services\AppLogsService;
use Exception;

class AppLogsController extends ApiController
{
    public function actionInsert()
    {
        $userId = getallheaders()["Userid"];
        try {
            echo $this->returnSuccess("Dados inserido com sucesso",
                (new AppLogsService)->insert($this->request(false), $userId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir dados");
        }
    }
}
