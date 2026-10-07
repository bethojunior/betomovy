<?php

namespace app\model;

use app\utils\BaseModel;

class DriversLinkedCallGroup extends BaseModel
{
    protected int $id;
    protected int $driverId;
    protected int $call_group_id;
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
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     */
    public function setDriverId($driverId): void
    {
        $this->driverId = $driverId;
    }

    /**
     * @return mixed
     */
    public function getCallGroupId()
    {
        return $this->call_group_id;
    }

    /**
     * @param mixed $callGroupId
     */
    public function setCallGroupId($callGroupId): void
    {
        $this->call_group_id = $callGroupId;
    }
}
