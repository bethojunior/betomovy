<?php

namespace App\Repositories\Trip;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripRouteTracing;

class TripRouteTracingRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TripRouteTracing::class);
    }

    public function findTracingByTrip(string $tripReference): ?string
    {
        $tracing = $this->getQuery()
            ->where('tripReference', $tripReference)
            ->value('tracing');

        // Rejeita tracing corrompido: polyline válida tem pelo menos 3 chars por ponto
        return (!empty($tracing) && strlen($tracing) > 2) ? $tracing : null;
    }
}
