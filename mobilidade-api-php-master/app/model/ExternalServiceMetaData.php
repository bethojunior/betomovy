<?php

namespace app\model;

use app\dao\ExternalServiceMetaDataDao;
use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/03/2020
 * Time: 11:53
 */
class ExternalServiceMetaData extends BaseModel
{
    protected $id;
    protected $key;
    protected $value;
    protected $externalServiceId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return ExternalServiceMetaData
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param mixed $key
     * @return ExternalServiceMetaData
     */
    public function setKey($key)
    {
        $this->key = $key;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     * @return ExternalServiceMetaData
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExternalServiceId()
    {
        return $this->externalServiceId;
    }

    /**
     * @param mixed $externalServiceId
     * @return ExternalServiceMetaData
     */
    public function setExternalServiceId($externalServiceId)
    {
        $this->externalServiceId = $externalServiceId;
        return $this;
    }

    public static function get(string $key, int $cityId = null)
    {
        $metadata = $cityId ? (new ExternalServiceMetaDataDao)->findByCity($key, $cityId) :
            (new ExternalServiceMetaDataDao)->find($key);

        return $metadata->value ?? null;
    }

    public static function getMany(...$keys)
    {
        $metadata = (new ExternalServiceMetaDataDao)
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($metadata as $config) {
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }
}