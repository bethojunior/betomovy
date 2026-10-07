<?php

namespace app\controllers;

use app\services\ConfigAppPartnerService;
use Exception;

class ConfigAppPartnerController extends ApiController
{
    public function actionGetConfigAppPartner()
    {
        try {
            $keyAppPartner = $_GET['app_partner'];
            $result = (new ConfigAppPartnerService)->getAppPartner($keyAppPartner);
            echo $this->returnSuccess("Configurações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de apps parceiros");
        }
    }

    public function actionFind_by_key()
    {
        try {
            $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
            $key = end($pathParts);
            $result = (new ConfigAppPartnerService)->findByKey($key);
            echo $this->returnSuccess("Parceiro encontrado", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar parceiro");
        }
    }
}
