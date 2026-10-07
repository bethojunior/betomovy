<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 09:48
 */
class PendencyField extends BaseModel
{
    protected $id;
    protected $userId;
    protected $pendencyFieldTypeId;
    protected $pendencyFieldStatusId;
    protected $created_at;
    protected $updated_at;
    protected $statusId;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return PendencyField
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     * @return PendencyField
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPendencyFieldTypeId()
    {
        return $this->pendencyFieldTypeId;
    }

    /**
     * @param mixed $pendencyFieldTypeId
     * @return PendencyField
     */
    public function setPendencyFieldTypeId($pendencyFieldTypeId)
    {
        $this->pendencyFieldTypeId = $pendencyFieldTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPendencyFieldStatusId()
    {
        return $this->pendencyFieldStatusId;
    }

    /**
     * @param mixed $pendencyFieldStatusId
     * @return PendencyField
     */
    public function setPendencyFieldStatusId($pendencyFieldStatusId)
    {
        $this->pendencyFieldStatusId = $pendencyFieldStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     * @return PendencyField
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     * @return PendencyField
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return PendencyField
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}