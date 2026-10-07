<?php


namespace App\Services\Delivery;


use App\Constants\StatusConst;
use App\Models\Delivery\TypeDeliveryCategory;
use App\Repositories\Delivery\TypeDeliveryCategoryRepository;

class TypeDeliveryCategoryService
{
    private $repository;

    public function __construct(TypeDeliveryCategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request): TypeDeliveryCategory
    {
        $typeDeliveryCategory = new TypeDeliveryCategory($request);
        $typeDeliveryCategory->save();

        return $typeDeliveryCategory;
    }

    public function list()
    {
        return $this->repository->findAll();
    }

    public function update(TypeDeliveryCategory $typeDeliveryCategory,array $request)
    {
        $typeDeliveryCategory->name = $request['name'];
        $typeDeliveryCategory->description = $request['description'];

        $typeDeliveryCategory->save();

        return $typeDeliveryCategory;
    }


    public function delete(TypeDeliveryCategory $typeDeliveryCategory)
    {
        $typeDeliveryCategory->statusId = StatusConst::REMOVED;

        $typeDeliveryCategory->save();

        return $typeDeliveryCategory;
    }
}
