<?php

namespace app\model;

use app\utils\BaseModel;

class ConfigAppPartner extends BaseModel
{
    protected $idAppPartner;

    protected $table = "config_apps_partners";

    /**
     * @return mixed
     */
    public function getIdAppPartner()
    {
        return $this->idAppPartner;
    }

    /**
     * @param mixed $idAppPartner
     */
    public function setIdUserType($idAppPartner)
    {
        $this->idAppPartner = $idAppPartner;
    }
}