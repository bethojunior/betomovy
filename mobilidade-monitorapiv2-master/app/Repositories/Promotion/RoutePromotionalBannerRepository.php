<?php


namespace App\Repositories\Promotion;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Promotion\RoutePromotionalBanner;

class RoutePromotionalBannerRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(RoutePromotionalBanner::class);
    }

    public function findAll()
    {
        return $this->getModel()::where('statusId', 1)
            ->get();
    }
}
