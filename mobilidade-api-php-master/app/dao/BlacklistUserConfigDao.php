<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 14:57
 */
class BlacklistUserConfigDao extends BaseDao
{
    protected $table = 'blacklistUserConfig';

    public function getByPenaltiesNumber($number)
    {
        return $this->sqlSelect([],
            [
                ['penaltiesQuantity', '>=', ':penaltiesNumber', 'AND'],
                ['statusId', '=', ':statusId']
            ],
            ['penaltiesQuantity', 'ASC'],
            1
        )
            ->bind([
                ':penaltiesNumber' => $number,
                ':statusId' => Status::ATIVO
            ])
            ->get(false);
    }
}