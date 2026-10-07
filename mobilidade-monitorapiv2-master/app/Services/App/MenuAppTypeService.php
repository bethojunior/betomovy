<?php


namespace App\Services\App;



use App\Repositories\App\MenuAppTypeRepository;

class MenuAppTypeService
{
    private $repository;

    public function __construct(MenuAppTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }
}
