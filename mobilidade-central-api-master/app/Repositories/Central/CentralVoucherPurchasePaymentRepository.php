<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralVoucherPurchasePayment;

class CentralVoucherPurchasePaymentRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralVoucherPurchasePayment::class);
    }

    public function findAllActives()
    {
        return $this->getModel()
            ::join('paymentForm', 'paymentForm.idPaymentForm', '=', 'centralVoucherPurchasePayment.paymentFormId')
            ->select('centralVoucherPurchasePayment.id',
                'centralVoucherPurchasePayment.paymentFormId',
                'centralVoucherPurchasePayment.isActive',
                'paymentForm.name as name'
            )
            ->where('centralVoucherPurchasePayment.statusId', StatusConst::ACTIVE)
            ->get();
    }
}
