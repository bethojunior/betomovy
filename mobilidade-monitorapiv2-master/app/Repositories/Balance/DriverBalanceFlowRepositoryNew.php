<?php

namespace App\Repositories\Balance;

use App\Models\Balance\BalanceFlow;
use Illuminate\Database\Eloquent\Builder;

class DriverBalanceFlowRepositoryNew
{
    public function getDriverReport(int $driverId, array $filters = [])
    {
        return BalanceFlow::with([
            'balance.driver.user',
            'balanceFlowType.flowType',
            'trip.origin',
            'trip.destination',
            'rewardTrip.rewardTripType',
            'rewardCampaignTrip.rewardTripType',
            'tax',
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
        ->get();
    }
}