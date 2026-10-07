<?php

namespace app\services;
use app\dao\ItemDao;
use app\model\Config;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 10:39
 */
class ItemService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new ItemDao;
    }

    public function getAll($request)
    {
        $items = $this->dao
            ->all($request->page ?? null, $request->description ?? null);

        $storage_link = Config::get('link_storage_pictures');

        $items['data'] = array_map(function ($item) use ($storage_link) {
            $item->picture = $storage_link . 'item/' . $item->picture;
            return $item;
        }, $items['data']);

        return $items;
    }
}