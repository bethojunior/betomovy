<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 16:17
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

    /**
     * @param $key
     * @return PushConfig
     */
    public function get($key): PushConfig
    {
        /** @var PushConfig $pushConfig */
        $pushConfig = $this->repository
            ->findByKey($key);

        return $pushConfig;
    }
}
