<?php

namespace app\services;
use app\dao\DeliveryInfoSuggestionDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:56
 */
class DeliveryInfoSuggestionService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DeliveryInfoSuggestionDao;
    }

    public function find()
    {
        return $this->dao
            ->find();
    }
}