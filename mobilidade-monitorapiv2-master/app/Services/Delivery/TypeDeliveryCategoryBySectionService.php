<?php

namespace App\Services\Delivery;

use App\Repositories\Delivery\TypeDeliveryCategoryBySectionRepository;

class TypeDeliveryCategoryBySectionService
{
    private $repository;

    public function __construct(TypeDeliveryCategoryBySectionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $this->repository->deleteAllByTypeDeliveryCategory($request['typeDeliveryCategoryId']);

        $this->repository->createMany(array_map(function ($deliverySectionId) use ($request) {
            return [
                'deliverySectionId' => $deliverySectionId,
                'typeDeliveryCategoryId' => $request['typeDeliveryCategoryId']
            ];
        }, $request['deliverySections']));
    }

    public function findByTypeDeliveryCategory($typeDeliveryCategoryId)
    {
        return $this->repository->findByTypeDeliveryCategory($typeDeliveryCategoryId);
    }
}
