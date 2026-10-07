<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2019
 * Time: 12:00
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

        return $config->getAttributeValue('value');
    }

    private function getMany(array $keys)
    {
        $configs = $this->repository
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($configs as $config){
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }
}
