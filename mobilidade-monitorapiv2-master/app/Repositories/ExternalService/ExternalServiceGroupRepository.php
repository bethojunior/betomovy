<?php


namespace App\Repositories\ExternalService;


use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceGroup;

class ExternalServiceGroupRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ExternalServiceGroup::class);
    }
}
