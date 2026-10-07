<?php


namespace app\model;

use app\utils\BaseModel;

class AdsCount extends BaseModel
{
    protected $primaryKey = 'id';
    protected $id;
    protected $userId;
    protected $menuAppId;
    protected $created_at;
    protected $advertisingId;

    /**
     * @return mixed
     */
    public function getAdvertisingId()
    {
        return $this->advertisingId;
    }

    /**
     * @param mixed $advertisingId
     * @return AdsCount
     */
    public function setAdvertisingId($advertisingId)
    {
        $this->advertisingId = $advertisingId;
        return $this;
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
     * @return AdsCount
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
     * @return AdsCount
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMenuAppId()
    {
        return $this->menuAppId;
    }

    /**
     * @param mixed $menuAppId
     * @return AdsCount
     */
    public function setMenuAppId($menuAppId)
    {
        $this->menuAppId = $menuAppId;
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
     * @return AdsCount
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }
}