<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/09/2019
 * Time: 17:17
 */
class AccessibilityAssistant extends BaseModel
{
    protected $id;
    protected $accessibilityId;
    protected $actionId;
    protected $helpId;
    protected $quantity;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return AccessibilityAssistant
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
     * @return AccessibilityAssistant
     */
    public function setAccessibilityId($accessibilityId)
    {
        $this->accessibilityId = $accessibilityId;
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
     * @return AccessibilityAssistant
     */
    public function setActionId($actionId)
    {
        $this->actionId = $actionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getHelpId()
    {
        return $this->helpId;
    }

    /**
     * @param mixed $helpId
     * @return AccessibilityAssistant
     */
    public function setHelpId($helpId)
    {
        $this->helpId = $helpId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * @param mixed $quantity
     * @return AccessibilityAssistant
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
        return $this;
    }

}