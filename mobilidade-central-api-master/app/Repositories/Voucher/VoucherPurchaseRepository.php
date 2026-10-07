<?php

namespace App\Repositories\Voucher;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Voucher\VoucherPurchase;

class VoucherPurchaseRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(VoucherPurchase::class);
    }

    public function register($data, $bonusVoucher)
    {
        return $this->getModel()
            ::create([
                'status' => $data->status,
                'status_detail' => null,
                'amount' => $bonusVoucher,
                'value' => $data->value,
                'captured' => null,
                'captured_amount' => null,
                'userId' => $data->userId,
                'cardId' => $data->cardId ?? null,
                'transactionId' => $data->idTransaction
            ]);
    }
}
