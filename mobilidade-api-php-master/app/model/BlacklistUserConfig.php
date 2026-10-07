<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 14:53
 */
class BlacklistUserConfig extends BaseModel
{
    protected $idBlacklistUserConfig;
    protected $penaltiesQuantity;
    protected $timeToSuspend;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdBlacklistUserConfig()
    {
        return $this->idBlacklistUserConfig;
    }

    /**
     * @param mixed $idBlacklistUserConfig
     * @return BlacklistUserConfig
     */
    public function setIdBlacklistUserConfig($idBlacklistUserConfig)
    {
        $this->idBlacklistUserConfig = $idBlacklistUserConfig;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPenaltiesQuantity()
    {
        return $this->penaltiesQuantity;
    }

    /**
     * @param mixed $penaltiesQuantity
     * @return BlacklistUserConfig
     */
    public function setPenaltiesQuantity($penaltiesQuantity)
    {
        $this->penaltiesQuantity = $penaltiesQuantity;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeToSuspend()
    {
        return $this->timeToSuspend;
    }

    /**
     * @param mixed $timeToSuspend
     * @return BlacklistUserConfig
     */
    public function setTimeToSuspend($timeToSuspend)
    {
        $this->timeToSuspend = $timeToSuspend;
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
     * @return BlacklistUserConfig
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}