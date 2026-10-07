<?php


namespace App\Services\Report\EstablishmentCollectionManagement;


use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\EstablishmentCollectionManagementReportRepository;
use Illuminate\Support\Facades\Auth;

class EstablishmentCollectionManagementReportService
{
    private $repository;

    public function __construct(EstablishmentCollectionManagementReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function totalChargePerCompany(array $request, int $cityId = null)
    {
        $charges = $this->repository->totalChargePerCompany($request, (bool)(Auth::user())->role->support, $cityId);

        return new ReportDefaultExport(
            $charges->transform(function ($charge) {
                return [
                    'ID do Estabelecimento' => $charge->idCompany,
                    'Nome' => $charge->company,
                    'Quantidade de Pedidos' => $charge->quantityOrder,
                    'Total dos Pedidos $' => brazilianCash($charge->valueOrder),
                    'Total Cobrança por Pedido $' => brazilianCash($charge->chargeOrderValue),
                    'Total Cobrança de Porcentagem do Pedido $' => brazilianCash($charge->chargeOrderPercentage),
                    'Total à Pagar $' => brazilianCash($charge->chargeTotal),
                ];
            })->toArray());
    }
}
