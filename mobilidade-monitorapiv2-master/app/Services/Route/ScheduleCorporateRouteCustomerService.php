<?php


namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Models\Route\ScheduleCorporateRouteCustomer;
use App\Repositories\Route\ScheduleCorporateRouteCustomerRepository;
use App\Repositories\Route\ScheduleCorporateRouteRepository;

class ScheduleCorporateRouteCustomerService
{
    /**
     * @var ScheduleCorporateRouteCustomerRepository
     */
    private $repository;

    public function __construct(ScheduleCorporateRouteCustomerRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return ScheduleCorporateRouteCustomer
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $scheduleCorporateRouteCustomer = new ScheduleCorporateRouteCustomer($request);
        if ($this->repository->findCustomer($request["corporateRouteCustomerId"], $request["scheduleCorporateRouteId"]))
            throw new \Exception("Cliente já cadastrado nessa rota");
        $this->repository->save($scheduleCorporateRouteCustomer);
        return $scheduleCorporateRouteCustomer;
    }

    public function listByScheduleCorporateRoute($scheduleCorporateRouteId)
    {
        return $this->repository->listCustomerByScheduleCorporateRouteId($scheduleCorporateRouteId);
    }

    public function delete($id)
    {
        $scheduleCorporateRouteCustomer = $this->repository->find($id);
        $scheduleCorporateRouteCustomer->statusId = StatusConst::REMOVED;
        $this->repository->save($scheduleCorporateRouteCustomer);
        return $scheduleCorporateRouteCustomer;
    }
}
