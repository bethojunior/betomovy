<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 15:02
 */
class FreightPictureDao extends BaseDao
{
    protected $table = 'freightPicture';

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect([], [
            ['tripReference', '=', ':tripReference']
        ], [], 1)
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }
}