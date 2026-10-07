<?php

namespace app\services;
use app\dao\FlowTypeDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2019
 * Time: 18:14
 */
class FlowTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new FlowTypeDao;
    }

    public function findAll()
    {
        return $this->dao->getAll();
    }
}