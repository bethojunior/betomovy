<?php


namespace Api\Services\Establishment;


use Common\Models\Establishment\EstablishmentBilling;
use Common\Repositories\Establishment\EstablishmentBillingRepository;
use Common\Utils\AsaasApi;

class EstablishmentBillingService
{
    private $repository;

    public function __construct(EstablishmentBillingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByCompany($companyId)
    {
        return $this->repository->findByCompany($companyId);
    }

    public function createCustomerInAsaas()
    {
        $user = \Auth::user();

        $asaasApi = new AsaasApi();

        $result = $asaasApi->createCustomer($user);

        $user->id_asaas = $result->id;

        $user->save();

        return $user;
    }

    public function createBillet(EstablishmentBilling $establishmentBilling)
    {

        $user = \Auth::user();

        $asaasApi = new AsaasApi();

        return $asaasApi->createBillet($user,$establishmentBilling);
    }
}
