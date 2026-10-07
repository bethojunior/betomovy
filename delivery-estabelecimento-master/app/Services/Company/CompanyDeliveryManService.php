<?php


namespace App\Services\Company;


use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryMan;
use App\Repositories\Company\CompanyDeliveryManRepository;
use App\Repositories\User\DriverRepository;

class CompanyDeliveryManService
{
    private $repository;
    private $driverRepository;

    public function __construct(CompanyDeliveryManRepository $repository, DriverRepository $driverRepository)
    {
        $this->repository = $repository;
        $this->driverRepository = $driverRepository;
    }

    /**
     * @param array $request
     * @return CompanyDeliveryMan
     * @throws \Exception
     */
    public function store(array $request)
    {
        $driver = $this->driverRepository->findByEmail($request['email']);

        if (!$driver)
            throw new \Exception("Entregador não encontrado");

        $companyId = \Auth::user()->companyWorker->companyId;

        if ($this->repository->findDeliveryManInCompany($driver->idDriver,$companyId))
            throw  new \Exception("Entregador já está vinculado a esse estabelecimento");

        $companyDeliveryMan = new CompanyDeliveryMan();
        $companyDeliveryMan->companyId = $companyId;
        $companyDeliveryMan->driverId = $driver->idDriver;

        $this->repository->save($companyDeliveryMan);

        return $companyDeliveryMan;
    }


    public function findDeliveryManByCompany(){
        $companyId = \Auth::user()->companyWorker->companyId;

        return $this->repository->findDeliveryManByCompanyId($companyId);
    }


    public function findDeliveryManByCompanyId($companyId){
        return $this->repository->findDeliveryManByCompanyId($companyId);
    }

    public function delete($id)
    {
        $companyDeliveryMan = $this->repository->find($id);

        $companyDeliveryMan->statusId = StatusConst::REMOVED;

        $this->repository->save($companyDeliveryMan);

        return $companyDeliveryMan;
    }
}
