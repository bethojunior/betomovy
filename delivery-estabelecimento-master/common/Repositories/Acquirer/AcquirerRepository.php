<?php

namespace Common\Repositories\Acquirer;

use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Acquirer\DeliveryFinancialIntermediary;

class AcquirerRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryFinancialIntermediary::class);
    }

    public function getFinancialIntermediaryActive() {
        return $this->getModel()::where('active', 1)
            ->where('statusId', 1)
            ->get();
    }
}
