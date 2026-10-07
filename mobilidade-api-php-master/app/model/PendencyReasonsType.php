<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2018
 * Time: 09:19
 */
class PendencyReasonsType extends BaseModel
{
    protected $idPendencyReasonsType;
    protected $name;

    protected $table = 'pendencyReasonsType';

    /**
     * @return mixed
     */
    public function getIdPendencyReasonsType()
    {
        return $this->idPendencyReasonsType;
    }

    /**
     * @param mixed $idPendencyReasonsType
     * @return PendencyReasonsType
     */
    public function setIdPendencyReasonsType($idPendencyReasonsType)
    {
        $this->idPendencyReasonsType = $idPendencyReasonsType;
        return $this;
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
     * @return PendencyReasonsType
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

}