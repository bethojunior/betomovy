<?php


namespace App\Services\Promotion;


use App\Constants\StatusConst;
use App\Models\Promotion\DiscountCouponDelivery;
use App\Repositories\Promotion\DiscountCouponDeliveryRepository;

class DiscountCouponDeliveryService
{
    private $repository;

    public function __construct(DiscountCouponDeliveryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @throws \Exception
     */
    public function store(array $request)
    {
        $discountCouponDelivery = new DiscountCouponDelivery($request);

        if ($this->repository->existCodeByCompany($discountCouponDelivery))
            throw new \Exception("Código do cupom indisponível");

        $this->repository->save($discountCouponDelivery);
    }

    public function list()
    {
        $companyId = \Auth::user()->companyWorker->companyId;

        return $this->repository->findAll($companyId);
    }

    public function delete($id)
    {
        $discountCouponDelivery = $this->repository->find($id);
        $discountCouponDelivery->statusId = StatusConst::REMOVED;
        $this->repository->save($discountCouponDelivery);
        return $discountCouponDelivery;
    }
}
