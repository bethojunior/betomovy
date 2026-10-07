<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 17:45
 */
class MilitaryUser extends BaseModel
{
    protected $id;
    protected $userId;
    protected $militaryForceId;
    protected $militaryStatusId;
    protected $militaryGraduationId;
    protected $om;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return MilitaryUser
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
     * @return MilitaryUser
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMilitaryForceId()
    {
        return $this->militaryForceId;
    }

    /**
     * @param mixed $militaryForceId
     * @return MilitaryUser
     */
    public function setMilitaryForceId($militaryForceId)
    {
        $this->militaryForceId = $militaryForceId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMilitaryStatusId()
    {
        return $this->militaryStatusId;
    }

    /**
     * @param mixed $militaryStatusId
     * @return MilitaryUser
     */
    public function setMilitaryStatusId($militaryStatusId)
    {
        $this->militaryStatusId = $militaryStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMilitaryGraduationId()
    {
        return $this->militaryGraduationId;
    }

    /**
     * @param mixed $militaryGraduationId
     * @return MilitaryUser
     */
    public function setMilitaryGraduationId($militaryGraduationId)
    {
        $this->militaryGraduationId = $militaryGraduationId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOm()
    {
        return $this->om;
    }

    /**
     * @param mixed $om
     * @return MilitaryUser
     */
    public function setOm($om)
    {
        $this->om = $om;
        return $this;
    }

}