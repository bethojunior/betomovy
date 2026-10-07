<?php

namespace app\model;

use app\utils\BaseModel;

class Acquirer extends BaseModel
{
    protected $intermediary_id;
    protected $acquirer_id;
    protected $customer_id;
    protected $payment_type;
    protected $name;
    protected $configs;
    protected $capture;
    protected $legacy = true;

    /**
     * @return mixed
     */
    public function getIntermediaryId()
    {
        return $this->intermediary_id;
    }

    /**
     * @param mixed $intermediary_id
     * @return Acquirer
     */
    public function setIntermediaryId($intermediary_id)
    {
        $this->intermediary_id = $intermediary_id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAcquirerId()
    {
        return $this->acquirer_id;
    }

    /**
     * @param mixed $acquirer_id
     * @return Acquirer
     */
    public function setAcquirerId($acquirer_id)
    {
        $this->acquirer_id = $acquirer_id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customer_id;
    }

    /**
     * @param mixed $customer_id
     * @return Acquirer
     */
    public function setCustomerId($customer_id)
    {
        $this->customer_id = $customer_id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaymentType()
    {
        return $this->payment_type;
    }

    /**
     * @param mixed $payment_type
     * @return Acquirer
     */
    public function setPaymentType($payment_type)
    {
        $this->payment_type = $payment_type;
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
     * @return Acquirer
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getConfigs()
    {
        return $this->configs;
    }

    /**
     * @param mixed $configs
     * @return Acquirer
     */
    public function setConfigs($configs)
    {
        $this->configs = $configs;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCapture()
    {
        return $this->capture;
    }

    /**
     * @param mixed $capture
     * @return Acquirer
     */
    public function setCapture($capture)
    {
        $this->capture = $capture;
        return $this;
    }

    /**
     * Valor default: true
     * @return mixed
     */
    public function getLegacy()
    {
        return $this->legacy;
    }

    /**
     * @param mixed $legacy
     * @return Acquirer
     */
    public function setLegacy($legacy)
    {
        $this->legacy = $legacy;
        return $this;
    }

    public function toArray()
    {
        $excludedKeys = ['table', 'primaryKey'];
        $data = [];

        foreach ($this as $key => $value) {
            if (in_array($key, $excludedKeys, true)) {
                continue;
            }

            $data[$key] = $value;
        }

        return $data;
    }
}
