<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2020
 * Time: 19:18
 */

namespace App\Services\Delivery;


use App\Models\Delivery\DeliveryCharge;
use App\Repositories\Delivery\DeliveryChargeRepository;

class DeliveryChargeService
{
    /**
     * @var DeliveryChargeRepository
     */
    private $repository;

    public function __construct(DeliveryChargeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findUnique()
    {
        return $this->repository->findUnique();
    }

    public function updateOrCreate(array $request)
    {
        $deliveryCharge = $this->findUnique();

        if (!$deliveryCharge)
            $deliveryCharge = new DeliveryCharge;

        $deliveryCharge->fill($request);

        $deliveryCharge->save();

        return $deliveryCharge;
    }
}
