<?php

namespace app\model;

use app\dao\FinancialIntermediaryDao;
use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 14:20
 */
class FinancialIntermediary extends BaseModel
{
    protected $idFinancialIntermediary;
    protected $name;
    protected $statusId;
    protected $active;

    /**
     * @return mixed
     */
    public function getIdFinancialIntermediary()
    {
        return $this->idFinancialIntermediary;
    }

    /**
     * @param mixed $idFinancialIntermediary
     * @return FinancialIntermediary
     */
    public function setIdFinancialIntermediary($idFinancialIntermediary)
    {
        $this->idFinancialIntermediary = $idFinancialIntermediary;
        return $this;
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
     * @return FinancialIntermediary
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return FinancialIntermediary
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $active
     * @return FinancialIntermediary
     */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }

    public static function findActiveId(int $cityId = null)
    {
        $financialIntermediary = null;

        if ($cityId) {
            $financialIntermediary = (new FinancialIntermediaryDao)->findActiveByCity($cityId);
        }
        if (!$financialIntermediary) {
            $financialIntermediary = (new FinancialIntermediaryDao)->findActive();
        }

        return $financialIntermediary->idFinancialIntermediary ?? null;
    }

    public static function findActive(int $cityId = null)
    {
        $financialIntermediary = null;

        if ($cityId) $financialIntermediary = (new FinancialIntermediaryDao)->findActiveByCity($cityId);
        if (!$financialIntermediary) $financialIntermediary = (new FinancialIntermediaryDao)->findActive();

        return $financialIntermediary;
    }

    public static function findCaptureId($id)
    {
        $financialIntermediary = (new FinancialIntermediaryDao)
            ->find($id);

        return $financialIntermediary ?? null;
    }
}