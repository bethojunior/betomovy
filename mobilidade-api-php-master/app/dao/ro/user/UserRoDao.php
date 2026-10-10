<?php

namespace app\dao\ro\user;

use app\model\User;
use app\utils\BaseDao;
use app\utils\Connection;

class UserRoDao extends BaseDao
{
    protected $table = 'user';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    /**
     * @param $idUser
     * @param array $fields
     * @return array|mixed
     */
    public function find($idUser, array $fields = [])
    {
        $res = $this->sqlSelect($fields, [
            ['idUser', '=', ':idUser', 'AND'],
            ['statusId', '=', ':statusId']
        ])
            ->bind([':idUser' => $idUser, ':statusId' => User::STATUS_ATIVO])
            ->get(false);

        if (!$res) {
            $res = $this->sqlSelect($fields, [
                ['idUser', '=', ':idUser']
            ])
                ->bind([':idUser' => $idUser])
                ->get(false);
        }

        return $res;
    }
}