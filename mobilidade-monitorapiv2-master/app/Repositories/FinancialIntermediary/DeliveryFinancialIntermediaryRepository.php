<?php

namespace App\Repositories\FinancialIntermediary;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\DeliveryFinancialIntermediary;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class DeliveryFinancialIntermediaryRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DeliveryFinancialIntermediary::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'deliveryAcquirerMetaData' => function (HasMany $query) use ($request) {
                    $query
                        ->where('showable', true)
                        ->select(
                            'deliveryAcquirerMetaData.key',
                            'deliveryAcquirerMetaData.value',
                            'deliveryAcquirerMetaData.description',
                            'deliveryAcquirerMetaData.deliveryFinancialIntermediaryId'
                        );
                }
            ])
            ->get();
    }

    public function disableAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->update(['active' => 0]);
    }
}
