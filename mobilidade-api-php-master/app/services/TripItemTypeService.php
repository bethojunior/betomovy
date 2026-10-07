<?php

namespace app\services;
use app\dao\TripItemTypeDao;
use app\model\Config;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:58
 */
class TripItemTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TripItemTypeDao;
    }

    public function getAll()
    {
        $link = Config::get('link_storage_pictures');

        return array_map(function ($tripItemType) use ($link) {
            $tripItemType->picture = $link ?
                $link . 'tripItemType/' . $tripItemType->picture : null;
            return $tripItemType;
        }, $this->dao
            ->getAll());
    }
}