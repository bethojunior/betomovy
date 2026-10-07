<?php


namespace App\Repositories\ConfigAppPartners;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ConfigAppPartners\ConfigAppPartners;

class ConfigAppPartnersRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ConfigAppPartners::class);
    }

    public function findWithoutPagination()
    {
        return $this->getModel()::all();
    }

    public function findConfigsAppsWithPagination()
    {
        return $this->getModel()::paginate();
    }

    public function findConfigAppById(int $id)
    {
        $response = $this->getModel()::where('id', $id)->first();

        if ($response) {
            return $response;
        } else {
            return null;
        }
    }

    public function findByName(String $nameConfig)
    {
        $response = $this->getModel()::where('name_app', $nameConfig)->first();

        if ($response) {
            return $response;
        } else {
            return null;
        }
    }
}
