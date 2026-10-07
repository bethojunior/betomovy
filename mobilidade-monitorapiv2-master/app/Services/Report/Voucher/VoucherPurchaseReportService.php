<?php


namespace App\Services\Report\Voucher;


use App\Exports\Report\ReportDefaultExport;
use App\Models\Trip\VoucherPurchase;
use App\Repositories\Report\VoucherPurchaseReportRepository;
use Illuminate\Support\Facades\Auth;

class VoucherPurchaseReportService
{
    /**
     * @var VoucherPurchaseReportRepository
     */
    private $voucherPurchaseReportRepository;

    public function __construct(VoucherPurchaseReportRepository $voucherPurchaseReportRepository
    )
    {
        $this->voucherPurchaseReportRepository = $voucherPurchaseReportRepository;
    }

    public function findAll(array $request = [])
    {
        $purchases = $this->voucherPurchaseReportRepository
            ->findAll($request, (Auth::user())->role);

        return new ReportDefaultExport($purchases->transform(function (VoucherPurchase $voucherPurchase) {
            return [
                'ID Compra' => $voucherPurchase->idVoucherPurchase,
                'Data' => $voucherPurchase->created_at->format('d/m/Y H:i:s'),
                'Status' => $voucherPurchase->status,
                'Status Detalhado' => $voucherPurchase->status_detailed,
                'Status Transação' => $voucherPurchase->transactionStatus,
                'Montante' => $voucherPurchase->amount,
                'Valor Pago' => $voucherPurchase->value,
                'ID Transação Interna' => $voucherPurchase->transactionId,
                'ID Pagamento Adquirente' => $voucherPurchase->generatedPaymentId,
                'Adquirente' => $voucherPurchase->acquirer,
                'Forma de Pagamento' => $voucherPurchase->paymentForm,
                'Nome do Comprador' => $voucherPurchase->name,
                'Telefone do Comprador' => $voucherPurchase->phone,
                'Email do Comprador' => $voucherPurchase->email,
            ];
        })
            ->toArray()
        );
    }
}
