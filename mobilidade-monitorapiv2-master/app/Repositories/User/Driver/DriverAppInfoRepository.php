<?php


namespace App\Repositories\User\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverAppInfo;

class DriverAppInfoRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriverAppInfo::class);
    }

    public function findByDriver($driverId, $date = null)
    {
        $query = $this->getModel()::where("driverId", $driverId);

        if ($date) {
            $query->whereDate("created_at", $date);
        }

        return $query->orderByDesc("id")->paginate();
    }
}
