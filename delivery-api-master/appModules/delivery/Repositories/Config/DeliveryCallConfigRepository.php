<?php

namespace Delivery\Repositories\Config;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Helpers\Traits\ConfigRepositoryTrait;
use Delivery\Models\Config\DeliveryCallConfig;

class DeliveryCallConfigRepository extends AbstractRepository
{
    use ConfigRepositoryTrait;

    public function __construct()
    {
        $this->setModel(DeliveryCallConfig::class);
    }
}
