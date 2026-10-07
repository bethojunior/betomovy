<?php


namespace App\Repositories\ConfigListContacts;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ConfigListContacts\ConfigListContactsGeneral;

class ConfigListContactsGeneralRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ConfigListContactsGeneral::class);
    }

    public function getConfigListContacts()
    {
        return $this->getModel()::all();
    }

    public function findConfigListContactById(int $id)
    {
        $response = $this->getModel()::where('id', $id)->first();

        if ($response) {
            return $response;
        } else {
            return null;
        }
    }
}
