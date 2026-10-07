<?php

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\IntegrationPartnersLogs;

class IntegrationPartnersLogsRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(IntegrationPartnersLogs::class);
    }
}
