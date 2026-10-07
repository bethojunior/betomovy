<?php

namespace App\Services\Central;

use App\Repositories\Central\CentralVoucherPurchasePaymentRepository;

class CentralVoucherPurchasePaymentService
{
    private $repository;

    public function __construct(CentralVoucherPurchasePaymentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAllActives()
    {
        return $this->repository->findAllActives();
    }
}
