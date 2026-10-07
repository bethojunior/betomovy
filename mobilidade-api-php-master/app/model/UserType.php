<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:19
 */
class UserType extends BaseModel
{
    const GESTOR = 1;
    const COLABORADOR = 2;
    const MOTORISTA = 3;
    const ADMINISTRADOR = 4;
    const CLIENTE_FINAL = 5;
    const CLIENTE_FINAL_PARCEIRO = 6;
    const MOTORISTA_PARTICULAR = 7;
    const MOTORISTA_RETURN = 8;
    const DRIVERS_TYPE = [3, 7, 8, 11];

    protected $idUserType;
    protected $name;

    protected $table = "userType";

    /**
     * @return mixed
     */
    public function getIdUserType()
    {
        return $this->idUserType;
    }

    /**
     * @param mixed $idUserType
     */
    public function setIdUserType($idUserType)
    {
        $this->idUserType = $idUserType;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

}