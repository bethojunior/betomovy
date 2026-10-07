<?php

namespace App\Console\Commands\VoucherInPix;

use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\FinancialIntermediary\AcquirerMetaDataRepository;
use App\Repositories\Report\VoucherPurchaseReportRepository;
use App\Utils\Acquirers\ZsPay\ZsPay;
use Illuminate\Console\Command;
use App\Constants\Transaction\TransactionConst;

class VoucherInPixCommand extends Command
{
    protected $signature = "voucher-pix";

    protected $voucherPurchaseRepository;
    protected $acquirerMetaDataRepository;

    public function __construct(
        VoucherPurchaseReportRepository              $voucherPurchaseRepository,
        AcquirerMetaDataRepository                   $acquirerMetaDataRepository
    )
    {
        parent::__construct();
        $this->voucherPurchaseRepository = $voucherPurchaseRepository;
        $this->acquirerMetaDataRepository = $acquirerMetaDataRepository;
    }

    public function handle()
    {
        $pendingPayment = $this->voucherPurchaseRepository->findByStatus();

        array_map(function ($payment) {
            $confiance = $this->acquirerMetaDataRepository->findByKey('zspay_token');
            $connection = new ZsPay($confiance['value']);
            $sale = $connection->getSale()->find($payment['generatedPaymentId']);

            if($sale->venda->status->id == 2){
                $this->voucherPurchaseRepository->updateStatus($payment['generatedPaymentId'], 'Aprovado', TransactionConst::APPROVED);

                $addVoucher = $this->addVoucher($payment['userId'], $payment['amount']);

                if(!$addVoucher){
                    $connection->getTransfer()->refund($payment['generatedPaymentId']);
                    throw new \Exception('Ocorreu um erro ao adicionar saldo para esta central, o valor pago será extornado');
                }
            }

            if($sale->venda->status->id == 4){
                $this->voucherPurchaseRepository->updateStatus($payment['generatedPaymentId'], 'Cancelado', TransactionConst::CANCELED);
            }
        }, $pendingPayment->toArray());

        return 0;
    }

    public function addVoucher($responsibleId, $bonusVoucher){
        $balanceRepository = new BalanceRepository();
        $centralRepository = new CentralRepository();

        $central = $centralRepository->findByResponsible($responsibleId);

        if($central->balanceId == 0){
            $central->balanceId = $balanceRepository->createBalance()->idBalance;
            $centralRepository->updateBalanceId($responsibleId, $central->balanceId);
        }

        $currentBalance = $balanceRepository->findById($central->balanceId)->tripBalance;

        return $balanceRepository->updateBalance($central->balanceId, 'tripBalance', (floatval($bonusVoucher) + floatval($currentBalance)));
    }
}
