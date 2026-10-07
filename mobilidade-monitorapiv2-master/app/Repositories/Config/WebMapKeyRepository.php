<?php

namespace App\Repositories\Config;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\WebMapKey;

class WebMapKeyRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(WebMapKey::class);
    }
}
