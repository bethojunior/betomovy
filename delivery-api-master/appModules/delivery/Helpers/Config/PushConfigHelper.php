<?php

namespace Delivery\Helpers\Config;

use Delivery\Helpers\Traits\ConfigHelperTrait;
use Delivery\Repositories\Config\PushConfigRepository;

class PushConfigHelper
{
    use ConfigHelperTrait;

    public function __construct(PushConfigRepository $repository)
    {
        $this->repository = $repository;
    }

}
