<?php

namespace Delivery\Repositories\Config;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Helpers\Traits\ConfigRepositoryTrait;
use Delivery\Models\Config\PushConfig;

class PushConfigRepository extends AbstractRepository
{
    use ConfigRepositoryTrait;

    public function __construct()
    {
        $this->setModel(PushConfig::class);
    }
}
