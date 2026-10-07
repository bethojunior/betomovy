<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralVoucherPurchasePayment;
use function Aws\map;

class CentralVoucherPurchasePaymentRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralVoucherPurchasePayment::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::join('paymentForm', 'paymentForm.idPaymentForm', '=', 'centralVoucherPurchasePayment.paymentFormId')
            ->select('centralVoucherPurchasePayment.id',
                'centralVoucherPurchasePayment.paymentFormId',
                'centralVoucherPurchasePayment.isActive',
                'paymentForm.name as name'
            )
            ->where('statusId',StatusConst::ACTIVE)
            ->get();
    }

    public function updateVoucherPurchasePaymentForm(array $data)
    {
        foreach ($data as $item) {
            $this->getModel()
                ::where('paymentFormId', $item['paymentFormId'])
                ->update([
                    'isActive' => $item['isActive']
                ]);
        }

        return true;
    }
}
