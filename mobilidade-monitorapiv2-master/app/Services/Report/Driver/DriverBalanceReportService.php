<?php

namespace App\Services\Report\Driver;

use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\BalanceFlowReportRepository;
use Illuminate\Support\Facades\Auth;

class DriverBalanceReportService
{
    /**
     * @var BalanceFlowReportRepository
     */
    private $repository;

    public function __construct(BalanceFlowReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function driverBalanceMovements(array $request = []): ReportDefaultExport
    {
        $movements = $this->repository
            ->driverBalanceMovements($request, (Auth::user())->role);

        return new ReportDefaultExport($movements->transform(function ($balanceFlow) {
            return [
                'Data' => $balanceFlow->date->format('d/m/Y H:i:s'),
                'Valor' => $balanceFlow->flow == 'entrada' ? brazilianCash($balanceFlow->amount) : brazilianCash($balanceFlow->amount * -1),
                'Descrição' => $balanceFlow->operation_type,
                'Motorista' => $balanceFlow->driver_name,
                'Telefone' => $balanceFlow->driver_phone,
                'Email' => $balanceFlow->driver_email,
                'Responsável pela Movimentação' => $balanceFlow->responsible_user_name ?? 'Sistema',
                'Email do Responsável' => $balanceFlow->responsible_user_email ?? '-'
            ];
        })
            ->toArray()
        );
    }
}