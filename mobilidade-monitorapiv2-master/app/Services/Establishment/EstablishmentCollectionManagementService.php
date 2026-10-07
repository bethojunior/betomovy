<?php


namespace App\Services\Establishment;

use App\Exceptions\Company\EstablishmentException;
use App\Models\Establishment\EstablishmentCollectionManagement;
use App\Repositories\Establishment\EstablishmentCollectionManagementRepository;

class EstablishmentCollectionManagementService
{
    private $repository;

    public function __construct(EstablishmentCollectionManagementRepository $repository)
    {
        $this->repository = $repository;
    }


    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function find(int $id)
    {
        return EstablishmentCollectionManagement::findOrFail($id);
    }

    public function getCompaniesById(int $id)
    {
        return $this->repository->getCompaniesById($id);
    }

    public function save(array $data)
    {
        return EstablishmentCollectionManagement::create($data);
    }

    public function delete(int $id)
    {
        $companies = $this->repository->getCompaniesById($id);

        if (isset($companies[0])) throw new EstablishmentException("Não é possível deletar a cobrança, pois ainda existem estabelecimento utilizando-as!");

        $establishmentCollectionManagement = EstablishmentCollectionManagement::findOrFail($id);

        return $establishmentCollectionManagement->update(['statusId' => 2]);
    }
}
