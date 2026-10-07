<?php

namespace App\Services\Enum;

use App\Repositories\Enum\BankRepository;

class BankService
{
    /**
     * @var BankRepository
     */
    private $repository;

    public function __construct(BankRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }
}
