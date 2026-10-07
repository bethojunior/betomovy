<?php

namespace app\dao;

use app\model\ConfigAppPartner;
use app\model\UserType;
use app\utils\BaseDao;

class UserTypeLinkedAppPartnerDao extends BaseDao
{
    public $table = 'userTypeLinkedAppPartner';

    public function getAllUserTypeLinkedAppPartner()
    {
        $userTypeTable = (new UserType())->getTableName();
        $configAppPartnerTable = (new ConfigAppPartner())->getTableName();

        $sql = "
        SELECT 
            userTypeLinked.*, 
            userType.*,
            configAppPartner.*
        FROM {$this->table} AS userTypeLinked
        INNER JOIN {$userTypeTable} AS userType 
            ON userTypeLinked.userTypeId = userType.idUserType
        INNER JOIN {$configAppPartnerTable} AS configAppPartner
            ON userTypeLinked.config_apps_partners_id = configAppPartner.id;
        ";

        return $this->sqlRawSelect($sql, [])->get(false);
    }
}