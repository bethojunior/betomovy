<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/09/2019
 * Time: 17:01
 */
class AccessibilityObstacle extends BaseModel
{
    protected $id;
    protected $accessibilityId;
    protected $obstacleOnFloorId;
    protected $actionId;
    protected $numberFloor;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return AccessibilityObstacle
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAccessibilityId()
    {
        return $this->accessibilityId;
    }

    /**
     * @param mixed $accessibilityId
     * @return AccessibilityObstacle
     */
    public function setAccessibilityId($accessibilityId)
    {
        $this->accessibilityId = $accessibilityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getObstacleOnFloorId()
    {
        return $this->obstacleOnFloorId;
    }

    /**
     * @param mixed $obstacleOnFloorId
     * @return AccessibilityObstacle
     */
    public function setObstacleOnFloorId($obstacleOnFloorId)
    {
        $this->obstacleOnFloorId = $obstacleOnFloorId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getActionId()
    {
        return $this->actionId;
    }

    /**
     * @param mixed $actionId
     * @return AccessibilityObstacle
     */
    public function setActionId($actionId)
    {
        $this->actionId = $actionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNumberFloor()
    {
        return $this->numberFloor;
    }

    /**
     * @param mixed $numberFloor
     * @return AccessibilityObstacle
     */
    public function setNumberFloor($numberFloor)
    {
        $this->numberFloor = $numberFloor;
        return $this;
    }

}