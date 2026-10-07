<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/10/2019
 * Time: 17:28
 */

namespace App\Helpers\Config;


use App\Repositories\Config\ConfigRepository;

class ConfigHelper
{
    /**
     * @var ConfigRepository
     */
    private $repository;

    public function __construct(ConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    public function get(...$key)
    {
        if (count($key) > 1)
            return $this->getMany($key);

        $config = $this->repository
            ->findByKey($key[0]);

        return $this->mutator($config->key, $config->getAttributeValue('value'));
    }

    private function getMany(array $keys)
    {
        $configs = $this->repository
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($configs as $config){
            $responseConfigs +=
                [$config->key => $this->mutator($config->key, $config->value)];
        }

        return $responseConfigs;
    }

    private function mutator($key, $value)
    {
        switch ($key) {
            case 'cloud_firestore':
                return (boolean) $value;
            case 'firebase_cloud_firestore_key':
                return json_decode($value);
            default:
                return $value;
        }
    }
}
