<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 10:34
 */

namespace App\Helpers\Config;


use App\Models\Config\PushConfig;
use App\Repositories\Config\PushConfigRepository;

class PushConfigHelper
{
    /**
     * @var PushConfigRepository
     */
    private $repository;

    public function __construct(PushConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    public function get(...$key)
    {
        if (count($key) > 1)
            return $this->getMany($key);

        $config = $this->repository
            ->findByKey($key[0]);

        $config->addHidden(['id', 'key']);

        return $config->toArray();
    }

    private function getMany(array $keys)
    {
        /** @var PushConfig[] $configs */
        $configs = $this->repository
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($configs as $config){
            $config->addHidden(['id', 'key']);

            $responseConfigs +=
                [$config->key => $config->toArray()];
        }

        return $responseConfigs;
    }
}
