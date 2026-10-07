<?php

namespace app\controllers;
use app\dao\CardTypeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 09:54
 */
class CardTypeController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando tipos de cartão",
                (new CardTypeDao)->getAll());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}