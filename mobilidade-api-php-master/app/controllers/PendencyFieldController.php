<?php

namespace app\controllers;

use app\services\PendencyFieldService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 18:40
 */
class PendencyFieldController extends ApiController
{
    public function actionCheck()
    {
        try {
            $result = (new PendencyFieldService)
                ->findByUser(Headers::getUserId());

            echo $this->returnSuccess("Listando pendências do usuario", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}