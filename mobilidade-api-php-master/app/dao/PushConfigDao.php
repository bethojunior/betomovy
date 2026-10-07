<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\PushConfig;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/03/2019
 * Time: 14:00
 */
class PushConfigDao extends BaseDao
{
    protected $table = 'pushConfig';

    /**
     * @param $key
     * @return null|PushConfig
     */
    public function find($key): ?PushConfig
    {
        $config = $this->sqlSelect(
            [],
            [["{$this->table}.key", '=', ':key']]
        )
            ->bind([':key' => $key])
            ->get(false);

        return $config ? new PushConfig($config) : null;
    }
}