<?php

namespace app\controllers;
use app\dao\CardFlagDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 09:48
 */
class CardFlagController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando bandeiras de cartão",
                (new CardFlagDao)->getAll());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}