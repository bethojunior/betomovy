<?php


namespace App\Repositories\Route;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\ScheduleCorporateRouteWeek;

class ScheduleCorporateRouteWeekRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ScheduleCorporateRouteWeek::class);
    }
}
