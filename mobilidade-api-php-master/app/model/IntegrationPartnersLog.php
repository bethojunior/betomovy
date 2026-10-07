<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

class IntegrationPartnersLog extends BaseModel
{
    protected $tripReference;
    protected $object;
    protected $integration_partners_id;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return $this
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getObject()
    {
        return $this->object;
    }

    /**
     * @param mixed $object
     * @return $this
     */
    public function setObject($object)
    {
        $this->object = $object;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIntegrationPartnersId()
    {
        return $this->integration_partners_id;
    }

    /**
     * @param mixed $integration_partners_id
     * @return $this
     */
    public function setIntegrationPartnersId($integration_partners_id)
    {
        $this->integration_partners_id = $integration_partners_id;
        return $this;
    }

    /**
     * Convert object properties to array
     * 
     * @return array
     */
    public function toArray()
    {
        return [
            'tripReference' => $this->tripReference,
            'object' => $this->object,
            'integration_partners_id' => $this->integration_partners_id,
            'created_at' => $this->created_at,
        ];
    }
}
