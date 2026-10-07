<?php


namespace App\Repositories\Order;


use Carbon\Carbon;
use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryOrder;

class DeliveryOrderRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryOrder::class);
    }

    public function dashboardByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where(\DB::raw('DATE_FORMAT(created_at, \'%d-%m-%Y\')'), Carbon::now()->format('d-m-Y'))
            ->select([
                \DB::raw('sum(if(deliveryOrderStatusId = 1, 1, 0)) as totalAccepted'),
                \DB::raw('sum(if(deliveryOrderStatusId NOT IN (1, 11, 12, 13), 1, 0)) as totalInProgress'),
                \DB::raw('sum(if(deliveryOrderStatusId = 12, 1, 0)) as totalFinished')
            ])
            ->first();
    }
}
