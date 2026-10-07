<?php

namespace App\Repositories\User;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\BlockReasons;
use Illuminate\Database\Eloquent\Collection;

class BlockReasonsRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(BlockReasons::class);
    }

    public function getActivesByDriver(int $driverId): Collection
    {
        return $this->getQuery()
            ->where('driverId', $driverId)
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
