<?php

namespace app\dao;

use app\utils\BaseDao;

class ConfigAppPartnerDao extends BaseDao
{
    public $table = 'config_apps_partners';

    public function getConfigAppPartners(string $keyAppPartner)
    {
        $sql = "SELECT * FROM config_apps_partners WHERE `key` = :keyApp;";
    
        $bind = [
            ':keyApp' => $keyAppPartner
        ];
    
        return $this->sqlRawSelect($sql, $bind)->get();
    }

    public function findByKey($key)
    {
        return $this->sqlRawSelect("SELECT * FROM config_apps_partners WHERE `key` = ?", [$key])->get();
    }
}
