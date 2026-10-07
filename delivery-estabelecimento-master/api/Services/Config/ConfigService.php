<?php

namespace Api\Services\Config;

use Api\Repositories\Config\ConfigRepository;

class ConfigService
{
    private $configRepository;

    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    public function findKeyMapbox()
    {
        return $this->configRepository->findKeyMapbox();
    }

}
