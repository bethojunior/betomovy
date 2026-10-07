<?php

namespace app\controllers;

use app\services\UserTypeLinkedAppPartnerService;
use Exception;

class UserTypeLinkedAppController extends ApiController
{
    public function actionGetUserTypeLinkedAppPartner()
    {
        try {
            $result = (new UserTypeLinkedAppPartnerService)->getUsersTypeLinked();
            echo $this->returnSuccess("Configurações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de apps parceiros");
        }
    }
}