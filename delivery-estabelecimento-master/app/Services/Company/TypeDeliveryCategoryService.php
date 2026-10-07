<?php


namespace App\Services\Company;


use App\Repositories\Company\TypeDeliveryCategoryRepository;

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
