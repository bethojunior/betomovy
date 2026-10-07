<?php

namespace Api\Services\Product;

use Api\Repositories\Product\DeliveryCategoryRepository;

class DeliveryCategoryService
{
    private $repository;

    public function __construct(DeliveryCategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updatePosition(array $request)
    {
        foreach ($request['categories'] as $item){
            $deliveryCategory = $this->repository->find($item['id']);
            $deliveryCategory->position = $item['position'];
            $deliveryCategory->save();
        }
    }
}
