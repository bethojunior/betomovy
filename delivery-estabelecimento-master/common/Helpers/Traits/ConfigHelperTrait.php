<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 14:50
 */

namespace Common\Helpers\Traits;


use Common\Repositories\Traits\ConfigRepositoryTrait;
use Illuminate\Database\Eloquent\Model;

trait ConfigHelperTrait
{
    /**
     * @var ConfigRepositoryTrait
     */
    protected $repository;

    public function get(...$key)
    {
        if (count($key) > 1)
            return $this->getMany($key);

        /** @var Model $config */
        $config = $this->repository
            ->findByKey($key[0]);

        $config->setHidden(['id', 'key']);

        return $config->toArray();
    }

    private function getMany(array $keys)
    {
        /** @var Model[] $configs */
        $configs = $this->repository
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($configs as $config){
            $config->setHidden(['id', 'key']);

            $responseConfigs +=
                [$config->key => $config->toArray()];
        }

        return $responseConfigs;
    }
}
