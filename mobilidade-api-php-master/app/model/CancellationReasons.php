<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 08/08/2018
 * Time: 14:16
 */
class CancellationReasons extends BaseModel
{
    protected $table = "cancellationReasons";

    protected $idCancellationReasons;
    protected $name;

    /**
     * @return mixed
     */
    public function getIdCancellationReasons()
    {
        return $this->idCancellationReasons;
    }

    /**
     * @param mixed $idCancellationReasons
     */
    public function setIdCancellationReasons($idCancellationReasons): void
    {
        $this->idCancellationReasons = $idCancellationReasons;
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
    public function setName($name): void
    {
        $this->name = $name;
    }

}