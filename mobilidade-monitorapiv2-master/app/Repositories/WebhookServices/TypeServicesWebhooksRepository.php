<?php

namespace App\Repositories\WebhookServices;

use App\Models\WebhookServices\TypeServicesWebhook;
use App\Contracts\Repository\AbstractRepository;

class TypeServicesWebhooksRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TypeServicesWebhook::class);
    }
}