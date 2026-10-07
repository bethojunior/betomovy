<?php


namespace Api\Services\Product;

use Api\Repositories\Product\DeliveryProductRepository;
use Common\Models\Order\DeliveryProduct;

class DeliveryProductService
{
    private $repository;

    public function __construct(DeliveryProductRepository $repository)
    {
        $this->repository = $repository;
    }

    public function changeActive(array $request, DeliveryProduct $deliveryProduct)
    {
        $deliveryProduct->active = $request['active'];
        $deliveryProduct->save();
        return $deliveryProduct;
    }
    public function updatePosition(array $request)
    {
        foreach ($request['products'] as $item){
            $deliveryProduct = $this->repository->find($item['id']);
            $deliveryProduct->position = $item['position'];
            $deliveryProduct->save();
        }
    }
}
