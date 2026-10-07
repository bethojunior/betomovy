<?php


namespace App\Services\Acquirer;



use App\Repositories\Acquirer\DeliveryAcquirerMetaDataRepository;

class DeliveryAcquirerMetaDataService
{
    private $repository;

    public function __construct(DeliveryAcquirerMetaDataRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getToken()
    {
        return $this->repository->getToken();
    }

    public function updateToken(array $request)
    {
        $this->repository->updateToken($request['value']);
    }
}
