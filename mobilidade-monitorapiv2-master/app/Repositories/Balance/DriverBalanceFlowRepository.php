<?php

namespace App\Repositories\Balance;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ReadOnly\View\DriverBalanceFlowRO;

class DriverBalanceFlowRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriverBalanceFlowRO::class);
    }

    public function findByDriver(int $driverid, array $request)
    {
        return $this->getQuery()
            ->where('driverId', $driverid)
            ->when(isset($request['date']) && $request['date'], function ($query) use ($request) {
                $date = explode(',', $request['date']);
                $startDate = $date[0];
                $endDate = $date[1];

                if ($startDate === $endDate) {
                    $query->whereDate('date', '=', $startDate);
                } else {
                    $query->whereBetween('date', [$startDate, $endDate]);
                }
            })
            ->select(
                'flow',
                'color',
                'balanceFlowTypeId',
                'value',
                'price',
                'summary',
                'tripReference',
                'date'
            )
            ->orderByDesc('date')
            ->paginate();
    }

}
