<?php


namespace App\Repositories\User\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\RewardTrip;

class RewardTripRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(RewardTrip::class);
    }
}
