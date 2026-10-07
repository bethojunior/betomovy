<?php

namespace App\Repositories\User\Driver;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\DriverSplitConfig;

class DriverSplitConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriverSplitConfig::class);
    }

    public function findByDriver(int $driverId): ?DriverSplitConfig
    {
        /** @var DriverSplitConfig $result */
        $result = $this->getQuery()
            ->select([
                'driverSplitConfig.id',
                'driverSplitConfig.driverId',
                'driverSplitConfig.financialIntermediaryId',
                'driverSplitConfig.externalId',
                'driverSplitConfig.status',
            ])
            ->where('driverId', $driverId)
            ->first();

        return $result;
    }
}
