<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/11/2018
 * Time: 15:00
 */
class AppDao extends BaseDao
{
    /**
     * @param $id
     * @return array|mixed
     */
    public function find($id)
    {
        return $this->sqlSelect([],
            [['idApp', '=', ':id']]
        )
            ->bind([':id' => $id])
            ->get(false);
    }

    /**
     * Buscar a versão da aplicação restful
     * @param $idApp
     * @param array $fields
     * @return mixed
     */
    public function getVersion($idApp, $fields = ['version'])
    {
        return $this->sqlSelect($fields, [['idApp', '=', ':idApp']])
            ->bind([':idApp' => $idApp])
            ->get(false);
    }
}