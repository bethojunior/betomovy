<?php


namespace app\model;

use app\utils\BaseModel;

class ScheduleCorporateRoute extends BaseModel
{
    protected $id;
    protected $schedule;
    protected $corporateRouteId;
    protected $title;
    protected $vacancies;
    protected $statusId;
    protected $created_at;
    protected $updated_at;
    protected $companyId;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? null;
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
     * @return ScheduleCorporateRoute
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSchedule()
    {
        return $this->schedule;
    }

    /**
     * @param mixed $schedule
     * @return ScheduleCorporateRoute
     */
    public function setSchedule($schedule)
    {
        $this->schedule = $schedule;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCorporateRouteId()
    {
        return $this->corporateRouteId;
    }

    /**
     * @param mixed $corporateRouteId
     * @return ScheduleCorporateRoute
     */
    public function setCorporateRouteId($corporateRouteId)
    {
        $this->corporateRouteId = $corporateRouteId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return ScheduleCorporateRoute
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getVacancies()
    {
        return $this->vacancies;
    }

    /**
     * @param mixed $vacancies
     * @return ScheduleCorporateRoute
     */
    public function setVacancies($vacancies)
    {
        $this->vacancies = $vacancies;
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
     * @return ScheduleCorporateRoute
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return null
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param null $created_at
     * @return ScheduleCorporateRoute
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return ScheduleCorporateRoute
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCompanyId()
    {
        return $this->companyId;
    }

    /**
     * @param mixed $companyId
     * @return ScheduleCorporateRoute
     */
    public function setCompanyId($companyId)
    {
        $this->companyId = $companyId;
        return $this;
    }


}