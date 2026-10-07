<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2020
 * Time: 11:43
 */

namespace App\Services\Delivery;


use App\Models\Delivery\DeliveryCallConfig;
use App\Repositories\Delivery\DeliveryCallConfigRepository;

class DeliveryCallConfigService
{
    /**
     * @var DeliveryCallConfigRepository
     */
    private $repository;

    public function __construct(DeliveryCallConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll()
    {
        return $this->repository->all();
    }

    /**
     * @param DeliveryCallConfig $deliveryCallConfig
     * @param array $request
     * @return DeliveryCallConfig
     */
    public function update(DeliveryCallConfig $deliveryCallConfig, array $request): DeliveryCallConfig
    {
        $deliveryCallConfig->value = $request['value'];
        $deliveryCallConfig->save();

        return $deliveryCallConfig;
    }
}
