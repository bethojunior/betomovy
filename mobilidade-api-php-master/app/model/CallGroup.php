<?php

namespace app\model;

use app\utils\BaseModel;

class CallGroup extends BaseModel
{
    protected int $id;
    protected string $name;
    protected string $image;
    protected int $weight;
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
     */
    public function setId($id): void
    {
        $this->id = $id;
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
    public function setName($nameCallGroup): void
    {
        $this->name = $nameCallGroup;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     */
    public function setImage($imageCallGroup): void
    {
        $this->image = $imageCallGroup;
    }

    /**
     * @return mixed
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * @param mixed $weight
     */
    public function setWeight($weightCallGroup): void
    {
        $this->weight = $weightCallGroup;
    }
}
