<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Cooperative;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 10:09
 */
class CooperativeDao extends BaseDao
{
    public function find($id)
    {
        return $this->sqlSelect([],
            [['idCooperative', '=', ':id']],
            [], 1
        )
            ->bind([':id' => $id])
            ->get(false);
    }

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function getAll()
    {
        try {
            return $this->sqlSelect()->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $stationId
     * @return array|mixed
     * @throws Exception
     */
    public function getByStation($stationId)
    {
        try {
            return $this->sqlSelect([], [
                ['stationId', '=', $stationId, 'AND'],
                ['statusId', '=', Cooperative::ATIVO]
            ])->get();
        } catch (Exception $e) {
            throw $e;
        }
    }
}