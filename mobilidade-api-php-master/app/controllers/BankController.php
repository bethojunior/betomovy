<?php

namespace app\controllers;
use app\dao\BankDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:50
 */
class BankController extends ApiController
{
    protected $bankDao;

    public function __construct()
    {
        $this->bankDao = new BankDao;
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Lista de bancos", $this->bankDao->sqlSelect()->get());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}