<?php


namespace App\Services\CancellationReasons;


use App\Repositories\CancellationReasons\CancellationReasonsTypeRepository;

class CancellationReasonsTypeService
{
    /**
     * @var CancellationReasonsTypeRepository
     */
    private $repository;

    /**
     * CancellationReasonsTypeService constructor.
     * @param CancellationReasonsTypeRepository $repository
     */
    public function __construct(CancellationReasonsTypeRepository $repository)
    {
        $this->repository = $repository;
    }
}
