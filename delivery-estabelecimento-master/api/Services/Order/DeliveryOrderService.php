<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 10:01
 */

namespace Api\Services\Order;


use Api\Repositories\Order\DeliveryOrderRepository;
use App\Models\Company\CompanyWorker;

class DeliveryOrderService
{
    /**
     * @var DeliveryOrderRepository
     */
    private $repository;

    public function __construct(DeliveryOrderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findActiveOrders()
    {
        /** @var CompanyWorker $companyWorker */
        $companyWorker = \Auth::user()->companyWorker;

        return $this->repository
            ->findActivesByCompany($companyWorker->companyId);
    }

    public function findOrderById($id)
    {
        return $this->repository->findFully($id);
    }

    public function findAll(array $request)
    {
        /** @var CompanyWorker $companyWorker */
        $companyWorker = \Auth::user()->companyWorker;

        return $this->repository
            ->findAll($companyWorker->companyId,$request);
    }
}
