<?php


namespace App\Repositories\Establishment;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;
use App\Models\Establishment\EstablishmentCollectionManagement;

class EstablishmentCollectionManagementRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(EstablishmentCollectionManagement::class);
    }

    public function findAll()
    {
        return $this->getModel()::where('statusId', 1)->get();
    }

    public function getCompaniesById(int $id)
    {
        return Company::where('establishmentCollectionManagementId', $id)->get();
    }
}
