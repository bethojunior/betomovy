<?php

namespace app\services;
use app\dao\PaymentFormTypeDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2019
 * Time: 13:50
 */
class PaymentFormTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new PaymentFormTypeDao;
    }

    public function getAll()
    {
        return $this->dao
            ->getAll();
    }
}