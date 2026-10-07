<?php


namespace App\Services\Delivery;


use App\Constants\StatusConst;
use App\Models\Delivery\DeliveryRate;
use App\Repositories\Delivery\DeliveryRateRepository;

class DeliveryRateService
{
    private $repository;

    public function __construct(DeliveryRateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request)
    {
        if ($this->repository->feeAlreadyExists($request['range'],$request['cityId']))
            throw new \Exception("Taxa já cadastrada na cidade");

        $deliveryRate = new DeliveryRate($request);
        $deliveryRate->save();
        return $deliveryRate;
    }

    public function getAll($cityId)
    {
        return $this->repository->getAll($cityId);
    }

    public function delete($id)
    {
        $deliveryRate = $this->repository->find($id);
        $deliveryRate->statusId = StatusConst::REMOVED;
        $deliveryRate->save();
    }
}
