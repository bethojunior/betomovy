<?php

namespace app\controllers;
use app\services\SiteService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/02/2020
 * Time: 08:30
 */
class SiteController extends ApiController
{
    public function actionSendContactEmail()
    {
        try {
            $request = $this->request(false);

            $result = (new SiteService)->sendContactEmail($request);

            echo $this->returnSuccess("Email enviado com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}