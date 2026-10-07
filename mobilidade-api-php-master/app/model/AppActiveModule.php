<?php

namespace app\model;

use app\utils\BaseModel;

class AppActiveModule extends BaseModel
{
    protected $id;
    protected $appModuleId;
    protected $logo;
    protected $isActive;
    protected $statusId;

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
    public function getAppModuleId()
    {
        return $this->appModuleId;
    }

    /**
     * @param mixed $appModuleId
     */
    public function setAppModuleId($appModuleId): void
    {
        $this->appModuleId = $appModuleId;
    }

    /**
     * @return mixed
     */
    public function getLogo()
    {
        return $this->logo;
    }

    /**
     * @param mixed $logo
     */
    public function setLogo($logo): void
    {
        $this->logo = $logo;
    }

    /**
     * @return mixed
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * @param mixed $isActive
     */
    public function setIsActive($isActive): void
    {
        $this->isActive = $isActive;
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
     */
    public function setStatusId($statusId): void
    {
        $this->statusId = $statusId;
    }


}