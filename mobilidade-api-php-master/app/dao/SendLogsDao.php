<?php

namespace app\dao;

use app\model\IntegrationPartnersLog;
use app\utils\BaseDao;
use app\utils\Connection;

class SendLogsDao extends BaseDao
{

    public function insertLog($tripReference, $object, $integration_partners_id)
    {
        $log = new IntegrationPartnersLog();
        $log->setTripReference($tripReference)
        ->setObject($object)
        ->setIntegrationPartnersId($integration_partners_id);

        return $this->noSqlInsert($log->toStdClass());
    }

}
