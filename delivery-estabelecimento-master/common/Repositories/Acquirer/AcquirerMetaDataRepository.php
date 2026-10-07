<?php

namespace Common\Repositories\Acquirer;

use Common\Contracts\Repository\AbstractRepository;

use Common\Models\Acquirer\DeliveryAcquirerMetaData;

class AcquirerMetaDataRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryAcquirerMetaData::class);
    }

    public function getAcquirer($acquirerId) {
        return $this->getModel()
            ::select('value')
            ->where('deliveryFinancialIntermediaryId', $acquirerId)
            ->get();
    }
}
