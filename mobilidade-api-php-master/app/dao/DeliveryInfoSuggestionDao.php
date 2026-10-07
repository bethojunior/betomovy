<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:55
 */
class DeliveryInfoSuggestionDao extends BaseDao
{
    protected $table = 'deliveryInfoSuggestion';

    public function find()
    {
        return $this->sqlSelect([],
            [['statusId', '=', ':statusId']], [], 1)
            ->bind([':statusId' => Status::ATIVO])
            ->get(false);
    }
}