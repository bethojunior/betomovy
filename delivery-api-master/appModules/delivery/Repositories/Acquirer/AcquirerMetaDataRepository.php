<?php

namespace Delivery\Repositories\Acquirer;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Acquirer\DeliveryAcquirerMetaData;

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
