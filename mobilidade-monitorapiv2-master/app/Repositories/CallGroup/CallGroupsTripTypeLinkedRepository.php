<?php

namespace App\Repositories\CallGroup;

use App\Contracts\Repository\AbstractRepository;
use App\Models\CallGroup\CallGroupsTripTypeLinked;

class CallGroupsTripTypeLinkedRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CallGroupsTripTypeLinked::class);
    }

    public function getCallGroupByTripTypeId(int $tripTypeId)
    {
        $response = $this->getModel()::where('tripTypeId', $tripTypeId)->get(['call_group_id']);

        if ($response) {
            return $response;
        }
        return null;
    }

    public function findCallGroupByIdAndTripType(int $callGroupId, int $idTripType)
    {
        $response = $this->getModel()::where('call_group_id', $callGroupId)
            ->where('tripTypeId', $idTripType)
            ->first();

        if ($response) {
            return $response;
        }
        return null;
    }

    public function removeCallGroups(int $tripTypeId, array $callGroupId)
    {
        return $this->getModel()::where('tripTypeId', $tripTypeId)
            ->whereIn('call_group_id', $callGroupId)
            ->delete();
    }
}
