<?php


namespace App\Services\Report\Voucher;


use App\Exports\Report\ReportDefaultExport;
use App\Models\Balance\BalanceFlow;
use App\Repositories\Report\BalanceFlowReportRepository;
use Illuminate\Support\Facades\Auth;

class VoucherReportService
{
    /**
     * @var BalanceFlowReportRepository
     */
    private $repository;

    public function __construct(BalanceFlowReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function voucherMovements(array $request = []): ReportDefaultExport
    {
        $movements = $this->repository
            ->voucherMovements($request, (Auth::user())->role);

        return new ReportDefaultExport($movements->transform(function (BalanceFlow $balanceFlow) {
            return [
                'Data' => $balanceFlow->date->format('d/m/Y H:i:s'),
                'Valor' => $balanceFlow->flow == 'entrada' ? brazilianCash($balanceFlow->value) : brazilianCash($balanceFlow->value * -1),
                'Descrição' => $balanceFlow->balanceFlowType,
                'Cliente' => $balanceFlow->name,
                'Telefone' => $balanceFlow->phone,
                'Email' => $balanceFlow->email,
                'Responsável pela Movimentação' => $balanceFlow->responsible_name ?? 'Sistema',
                'Email do Responsável' => $balanceFlow->responsible_email ?? '-'
            ];
        })
            ->toArray()
        );
    }

    public function voucherMovementsByCentral(array $request = []): ReportDefaultExport
    {
        $movements = $this->repository
            ->voucherMovementsByCentral($request, (Auth::user())->role);

        return new ReportDefaultExport($movements->transform(function (BalanceFlow $balanceFlow) {
            return [
                'Data' => $balanceFlow->date->format('d/m/Y H:i:s'),
                'Valor' => $balanceFlow->flow == 'entrada' ? brazilianCash($balanceFlow->value) : brazilianCash($balanceFlow->value * -1),
                'Descrição' => $balanceFlow->balanceFlowType,
                'Cliente' => $balanceFlow->name ?? $balanceFlow->centralName,
                'Telefone' => $balanceFlow->phone ?? $balanceFlow->responsiblePhone,
                'Email' => $balanceFlow->email ?? $balanceFlow->responsibleEmail
            ];
        })
            ->toArray()
        );
    }
}
