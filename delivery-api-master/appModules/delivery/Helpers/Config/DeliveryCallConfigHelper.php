<?php

namespace Delivery\Helpers\Config;

use Delivery\Helpers\Traits\ConfigHelperTrait;
use Delivery\Repositories\Config\DeliveryCallConfigRepository;

class DeliveryCallConfigHelper
{
    use ConfigHelperTrait;

    public function __construct(DeliveryCallConfigRepository $repository)
    {
        $this->repository = $repository;
    }
}
