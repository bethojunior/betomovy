<?php

namespace Delivery\Services\Delivery;

use Delivery\Repositories\Delivery\TypeDeliveryCategoryRepository;

class TypeDeliveryCategoryService
{
    private $repository;

    public function __construct(TypeDeliveryCategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }
}
