<?php

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\IntegrationPartners;

class IntegrationPartnersRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(IntegrationPartners::class);
    }

    public function updateIntegration($id, $values)
    {
        return $this->getModel()
        ::where("id", $id)
        ->update($values);
    }
}
