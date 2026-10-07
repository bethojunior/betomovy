<?php

namespace App\Services\Driver;

use App\Models\Balance\BalanceFlow;
use App\Models\Balance\FlowType;
use App\Models\Trip\RewardTrip;
use App\Models\Trip\RewardCampaignTrip;
use App\Models\Trip\Origin;
use App\Models\Trip\Destination;
use App\Models\Trip\Trip;
use App\Models\Trip\Tax;
use App\Models\Balance\Driver;
use App\Models\Balance\DriverBalanceFlow;
use App\Models\Balance\DriverBalance;
use App\Models\Balance\DriverBalanceFlowType;
use App\Repositories\Balance\DriverBalanceFlowRepositoryNew;
use Illuminate\Database\Eloquent\Builder;

class DriverFinancialReportService
{
    protected $repository;

    public function __construct(DriverBalanceFlowRepositoryNew $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Gera o relatório financeiro do motorista.
     *
     * @param int $driverId
     * @param array $filters
     * @return array
     */
    public function generateDriverReport(int $driverId, array $filters = [])
    {
        $balanceFlows = BalanceFlow::with([
            'balance.driver', // Relacionamento entre BalanceFlow e Driver via Balance
            'balanceFlowType.flowType', // Relacionamento com FlowType
            'trip', // Relacionamento com Trip
            'rewardTrip.rewardTripType', // Relacionamento com RewardTripType
            'rewardCampaignTrip.rewardTripType', // Relacionamento com RewardCampaignTripType
            'tax', // Relacionamento com Tax
        ])
        ->whereHas('balance.driver', function (Builder $query) use ($driverId) {
            $query->where('idDriver', $driverId);
        })
        ->when(isset($filters['startDate']), function (Builder $query) use ($filters) {
            $query->where('date', '>=', $filters['startDate']);
        })
        ->when(isset($filters['endDate']), function (Builder $query) use ($filters) {
            $query->where('date', '<=', $filters['endDate']);
        })
        ->orderBy('date', 'desc')
        ->distinct()
        ->paginate(15); // Paginação com limite de 15 registros
    
        // Transformar os resultados para retornar apenas os campos desejados
        $response = $balanceFlows->getCollection()->map(function ($balanceFlow) {
            return [
                'flow' => ($balanceFlow->balanceFlowType && $balanceFlow->balanceFlowType->flowType) ? $balanceFlow->balanceFlowType->flowType->flow : null,
                'color' => ($balanceFlow->balanceFlowType && $balanceFlow->balanceFlowType->flowType) ? $balanceFlow->balanceFlowType->flowType->color : null,
                'balanceFlowTypeId' => $balanceFlow->balanceFlowTypeId,
                'value' => $balanceFlow->value,
                'price' => $balanceFlow->trip ? $balanceFlow->trip->price : null,
                'summary' => $this->generateSummary($balanceFlow),
                'tripReference' => $balanceFlow->tripReference ?? null,
                'date' => $balanceFlow->date,
                'observation' => $balanceFlow->observation ?? null,
            ];
        });
    
        // Retornar a resposta paginada com os dados transformados
        return [
            'current_page' => $balanceFlows->currentPage(),
            'data' => $response,
            'first_page_url' => $balanceFlows->url(1),
            'from' => $balanceFlows->firstItem(),
            'last_page' => $balanceFlows->lastPage(),
            'last_page_url' => $balanceFlows->url($balanceFlows->lastPage()),
            'links' => $balanceFlows->linkCollection()->toArray(),
            'next_page_url' => $balanceFlows->nextPageUrl(),
            'path' => $balanceFlows->path(),
            'per_page' => $balanceFlows->perPage(),
            'prev_page_url' => $balanceFlows->previousPageUrl(),
            'to' => $balanceFlows->lastItem(),
            'total' => $balanceFlows->total(),
        ];
    }
    /**
     * Gera o resumo (summary) para o relatório.
     *
     * @param \App\Models\Balance\BalanceFlow $balanceFlow
     * @return string
     */
    private function generateSummary($balanceFlow): string
    {
        if ($balanceFlow->tripReference && $balanceFlow->trip) {
            return $balanceFlow->trip->origin->address . ' X ' . $balanceFlow->trip->destination->address;
        }
    
        if ($balanceFlow->rewardTrip && $balanceFlow->rewardTrip->rewardTripType) {
            return $balanceFlow->rewardTrip->rewardTripType->name ?? 'Recompensa';
        }
    
        if ($balanceFlow->rewardCampaignTrip && $balanceFlow->rewardCampaignTrip->rewardTripType) {
            return $balanceFlow->rewardCampaignTrip->rewardTripType->name ?? 'Campanha de Recompensa';
        }
    
        $summary = ($balanceFlow->balanceFlowType && $balanceFlow->balanceFlowType->name) ? $balanceFlow->balanceFlowType->name : 'Outro';
        
        if ($balanceFlow->tax && $balanceFlow->tax->name) {
            $summary = str_replace('{taxName}', $balanceFlow->tax->name, $summary);
        }
    
        return $summary;
    }
}