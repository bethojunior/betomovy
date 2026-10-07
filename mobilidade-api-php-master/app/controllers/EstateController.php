<?php

namespace app\controllers;
use app\dao\EstateDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 18/07/2018
 * Time: 14:19
 */
class EstateController extends ApiController
{
    protected $estateDao;

    public function __construct()
    {
        $this->estateDao = new EstateDao;
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando estados", $this->estateDao->sqlSelect()->get());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}