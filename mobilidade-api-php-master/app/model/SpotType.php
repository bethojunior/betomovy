<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 17:01
 */
class SpotType extends BaseModel
{
    const ESTABLISHMENT_INDICATION_BY_FILTER = 1;
    const ESTABLISHMENT_DIRECT_INDICATION = 2;

    protected $id;
    protected $name;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return SpotType
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return SpotType
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

}