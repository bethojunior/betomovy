<?php

namespace App\Repositories\User;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\PendencyReasons;
use Illuminate\Database\Eloquent\Collection;

class PendencyReasonsRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(PendencyReasons::class);
    }

    public function getActivesByDriver(int $driverId): Collection
    {
        return $this->getQuery()
            ->where('driverId', $driverId)
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
