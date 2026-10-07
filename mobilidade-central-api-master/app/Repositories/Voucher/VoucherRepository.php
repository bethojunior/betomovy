<?php

namespace App\Repositories\Voucher;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Voucher\Voucher;

class VoucherRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Voucher::class);
    }
}
