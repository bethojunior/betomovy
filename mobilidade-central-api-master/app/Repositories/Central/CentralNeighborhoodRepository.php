<?php

namespace App\Repositories\Central;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralNeighborhood;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CentralNeighborhoodRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralNeighborhood::class);
    }

    public function findByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->with([
                'central',
                'neighborhood' => function (BelongsTo $query) {
                    return $query->select([
                        'id',
                        'name'
                    ]);
                },
                'tripType'
            ])
            ->whereHas('neighborhood')
            ->get();
    }

    public function hasTripTypeInNeighborhoodByCentral($tripTypeId, $neighborhoodId, $centralId)
    {
        return $this->getModel()
            ::where('tripTypeId', $tripTypeId)
            ->where('neighborhoodId', $neighborhoodId)
            ->where('centralId', $centralId)
            ->exists();
    }
}
