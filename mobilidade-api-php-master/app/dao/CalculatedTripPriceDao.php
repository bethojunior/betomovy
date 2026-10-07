<?php

namespace app\dao;

use app\model\CalculatedTripPrice;
use app\queue\Jobs\PulseJob;
use app\queue\Queue;
use app\utils\BaseDao;


class CalculatedTripPriceDao extends BaseDao
{
    protected $table = 'calculatedTripPrice';

    public function getLastOnes()
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} cp
              GROUP BY cp.originLatitude, cp.originLongitude, cp.destinationLatitude, cp.destinationLongitude
              ORDER BY cp.created_at DESC, cp.price ASC
              LIMIT 40;
        ";

        return $this->sqlRawSelect($sql)
            ->get();
    }

    public function insert(array $props)
    {
        try {
            $payload = (object) [
                'priceId'             => $props['priceId'] ?? null,
                'userId'              => $props['userId'] ?? null,
                'price'               => $props['price'] ?? null,
                'multiplierValue'     => $props['multiplierValue'] ?? null,
                'competitivePrice'    => $props['competitivePrice'] ?? null,
                'tripTypeId'          => $props['tripTypeId'] ?? null,
                'originLatitude'      => $props['originLatitude'] ?? null,
                'originLongitude'     => $props['originLongitude'] ?? null,
                'originAddress'       => $props['originAddress'] ?? null,
                'destinationLatitude' => $props['destinationLatitude'] ?? null,
                'destinationLongitude' => $props['destinationLongitude'] ?? null,
                'destinationAddress'  => $props['destinationAddress'] ?? null,
            ];

            $handle = new CalculatedTripPrice($payload);

            return $this->sqlInsert($handle);
        } catch (\Throwable $th) {
            //throw $th;
            // Queue::dispatch(
            //     PulseJob::class,
            //     [
            //         'message' => $th->getMessage(),
            //         'context' => $th->getTrace(),
            //         'type' => 'critical'
            //     ]
            // );
        }
    }
}
