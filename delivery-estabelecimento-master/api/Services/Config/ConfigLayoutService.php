<?php

namespace Api\Services\Config;

use Api\Repositories\Config\ConfigLayoutRepository;

class ConfigLayoutService
{
    private $repository;

    public function __construct(ConfigLayoutRepository $configRepository)
    {
        $this->repository = $configRepository;
    }

    public function findLayout()
    {
        return $this->repository->getLayout();
    }
}
