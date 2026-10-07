<?php

namespace app\dao\ro\customer;

use app\constant\TripCancellationCustomerFeeConst;
use app\model\Status;
use app\utils\BaseDao;
use app\utils\Connection;

class TripCancellationCustomerFeeRoDao extends BaseDao
{
    protected $table = 'tripCancellationCustomerFee';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    /**
     * @param $userId
     * @return array|mixed
     */
    public function findByUser($userId)
    {
        return $this->sqlSelect(
            [],
            [
                ['userId', '=', ':userId', 'AND'],
                ['billing_status', '=', ':billing_status', 'AND'],
                ['statusId', '=', ':statusId']
            ]
        )
            ->bind([
                ':userId' => $userId,
                ':statusId' => Status::ATIVO,
                ':billing_status' => TripCancellationCustomerFeeConst::TO_COLLECT,
            ])
            ->get();
    }
}