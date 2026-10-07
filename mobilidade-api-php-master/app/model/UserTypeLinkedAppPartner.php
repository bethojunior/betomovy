<?php

namespace app\model;

use app\utils\BaseModel;

class UserTypeLinkedAppPartner extends BaseModel
{
    protected $idUserTypeLinked;

    protected $table = "userTypeLinkedAppPartner";

    /**
     * @return mixed
     */
    public function getIdUserTypeLinkedAppPartner()
    {
        return $this->idUserTypeLinked;
    }

    /**
     * @param mixed $idUserType
     */
    public function setIdUserTypeLinkedAppPartner($idUserTypeLinked)
    {
        $this->idUserTypeLinked = $idUserTypeLinked;
    }

}