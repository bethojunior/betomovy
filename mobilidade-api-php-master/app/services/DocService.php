<?php

namespace app\services;
use app\dao\DocDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/08/2020
 * Time: 11:44
 */
class DocService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DocDao;
    }

    public function findAll()
    {
        return $this->dao->findAll();
    }
}