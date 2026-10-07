<?php

namespace app\model;

use app\dao\AcquirerMetaDataDao;
use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 14:07
 */
class AcquirerMetaData extends BaseModel
{
    protected $id;
    protected $key;
    protected $value;
    protected $financialIntermediaryId;
    protected $description;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return AcquirerMetaData
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
     * @return AcquirerMetaData
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
     * @return AcquirerMetaData
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFinancialIntermediaryId()
    {
        return $this->financialIntermediaryId;
    }

    /**
     * @param mixed $financialIntermediaryId
     * @return AcquirerMetaData
     */
    public function setFinancialIntermediaryId($financialIntermediaryId)
    {
        $this->financialIntermediaryId = $financialIntermediaryId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     * @return AcquirerMetaData
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    public static function get(string $key)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->find($key);

        return $metadata->value ?? null;
    }

    public static function getFully(string $key)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->find($key);

        return $metadata ?? null;
    }

    public static function findAquirer(int $id)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->findIdAquirer($id);

        return $metadata->value ?? null;
    }

    public static function getByCity(string $key, int $cityId)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->findByCity($key, $cityId);

        return $metadata->value ?? null;
    }

    public static function getMany(...$keys)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($metadata as $config) {
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }

    public static function getManyByCity(int $cityId, ...$keys)
    {
        $metadata = (new AcquirerMetaDataDao)
            ->findManyByCity($keys, $cityId);

        $responseConfigs = [];

        foreach ($metadata as $config) {
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }

    public static function getCitiesForAcquirer(int $acquirerId)
    {
        $acquirerMetaDataDao = new AcquirerMetaDataDao();
        
        return $acquirerMetaDataDao->getCityValuesForAcquirer($acquirerId);
    }

    public static function getByAcquirerId(int $acquirerId)
    {
        $acquirerMetaDataDao = new AcquirerMetaDataDao();
        
        return $acquirerMetaDataDao->findByAcquirerId($acquirerId);
    }

    public static function getByCityId(int $acquirerId, int $cityId)
    {
        $acquirerMetaDataDao = new AcquirerMetaDataDao();
        
        return $acquirerMetaDataDao->findByCityId($acquirerId, $cityId);
    }
}