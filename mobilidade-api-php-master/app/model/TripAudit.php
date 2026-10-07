<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2018
 * Time: 11:43
 */
class TripAudit extends BaseModel
{
    const RELEASED = 1;
    const IN_ANALYSIS = 2;
    const BLOCKED = 3;

    const AUTOMATICALLY_RELEASED = 6;

    const CLOSE_DISTANCE = 150;
    const MEDIUM_DISTANCE = 200;

    protected $id;
    protected $situation;

    protected $table = 'tripAudit';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TripAudit
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSituation()
    {
        return $this->situation;
    }

    /**
     * @param mixed $situation
     * @return TripAudit
     */
    public function setSituation($situation)
    {
        $this->situation = $situation;
        return $this;
    }

}