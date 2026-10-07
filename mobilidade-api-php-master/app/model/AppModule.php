<?php

namespace app\model;

use app\utils\BaseModel;

class AppModule extends BaseModel
{
    protected $id;
    protected $name;

    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return AppModule
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
     * @return AppModule
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

}