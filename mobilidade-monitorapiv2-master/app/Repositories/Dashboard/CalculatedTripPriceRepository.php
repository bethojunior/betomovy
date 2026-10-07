<?php

namespace App\Repositories\Dashboard;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CalculatedTripPriceRepository
{
    private const ABANDONED_TRIP_CONVERSION_WINDOW_MINUTES = 5;

    private const DEFAULT_STATUS = [
        'searching',
        'searching_favorite',
        'accepted',
        'boarding',
        'in_progress',
        'finished',
    ];

    public function getAbandonedTrips(int $minutes = 15, ?int $cityId = null): array
    {
        $minutes = max($minutes, 1);
        $endDate = Carbon::now();
        $startDate = (clone $endDate)->subMinutes($minutes);

        $connection = DB::connection('mysql_ro');

        $query = $connection
            ->table('calculatedTripPrice as ctp')
            ->select([
                'ctp.id',
                'ctp.userId',
                'ctp.price',
                'ctp.multiplierValue',
                'ctp.competitivePrice',
                'ctp.tripTypeId',
                'ctp.originLatitude',
                'ctp.originLongitude',
                'ctp.originAddress',
                'ctp.destinationLatitude',
                'ctp.destinationLongitude',
                'ctp.destinationAddress',
                'ctp.created_at',
                'u.name as customerName',
                'u.phone as customerPhone',
                'p.name as priceName',
                'tt.type as tripTypeName',
                DB::raw($this->buildAbandonedCaseExpression() . ' as is_abandoned'),
            ])
            ->leftJoin('price as p', 'p.id', '=', 'ctp.priceId')
            ->leftJoin('tripType as tt', 'tt.idTripType', '=', 'ctp.tripTypeId')
            ->leftJoin('user as u', 'u.idUser', '=', 'ctp.userId')
            ->whereBetween('ctp.created_at', [$startDate, $endDate])
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('calculatedTripPrice as dup')
                    ->whereColumn('dup.userId', 'ctp.userId')
                    ->whereColumn('dup.created_at', 'ctp.created_at')
                    ->whereColumn('dup.id', '<', 'ctp.id');
            })
            ->orderByDesc('ctp.created_at');

        if (!is_null($cityId)) {
            $query->where('p.cityId', $cityId);
        }

        /** @var Collection<int, object> $records */
        $records = $query->get();

        if ($records->isNotEmpty()) {
            $signatureMap = $records->map(function ($record) {
                return [
                    'signature' => $this->buildSignature($record->userId, $record->created_at),
                    'userId' => $record->userId,
                    'created_at' => $record->created_at,
                ];
            });

            $signatureValues = $signatureMap
                ->pluck('signature')
                ->unique()
                ->values();

            $detailsQuery = $connection
                ->table('calculatedTripPrice as ctp')
                ->select([
                    'ctp.id',
                    'ctp.userId',
                    'ctp.price',
                    'ctp.tripTypeId',
                    'ctp.created_at',
                    'tt.type as tripTypeName',
                ])
                ->leftJoin('tripType as tt', 'tt.idTripType', '=', 'ctp.tripTypeId');

            if ($signatureValues->isEmpty()) {
                $details = collect();
            } else {
                $details = $detailsQuery
                    ->where(function ($builder) use ($signatureMap) {
                        foreach ($signatureMap as $signature) {
                            $builder->orWhere(function ($sub) use ($signature) {
                                $sub->where('ctp.userId', $signature['userId'])
                                    ->where('ctp.created_at', $signature['created_at']);
                            });
                        }
                    })
                    ->get()
                ->groupBy(function ($detail) {
                    return $this->buildSignature($detail->userId, $detail->created_at);
                    });
            }

            $records = $records->map(function ($record) use ($details) {
                $signature = $this->buildSignature($record->userId, $record->created_at);
                $record->tripOptions = $details->get($signature, collect())
                    ->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'tripTypeId' => $detail->tripTypeId,
                            'tripTypeName' => $detail->tripTypeName,
                            'price' => $detail->price,
                        ];
                    })->values();

                return $record;
            });
        }

        return [
            'summary' => $this->buildSummary($records),
            'items' => $records->map(function ($record) {
                $record->is_abandoned = (bool) $record->is_abandoned;
                return $record;
            }),
        ];
    }

    private function buildAbandonedCaseExpression(): string
    {
        $statusList = "'" . implode("','", self::DEFAULT_STATUS) . "'";
        $window = self::ABANDONED_TRIP_CONVERSION_WINDOW_MINUTES;

        return <<<SQL
CASE
    WHEN EXISTS (
        SELECT 1
        FROM trip t
        WHERE t.userId = ctp.userId
          AND t.date BETWEEN ctp.created_at AND DATE_ADD(ctp.created_at, INTERVAL {$window} MINUTE)
          AND t.status IN ({$statusList})
    )
    THEN 0
    ELSE 1
END
SQL;
    }

    private function buildSignature($userId, $createdAt): string
    {
        return $userId . '|' . $createdAt;
    }

    private function buildSummary(Collection $records): array
    {
        return [
            'total' => $records->count(),
            'abandoned' => $this->countDistinctCustomers($records, true),
            'abandonedAttempts' => $records->where('is_abandoned', 1)->count(),
            'converted' => $this->countDistinctCustomers($records, false),
        ];
    }

    private function countDistinctCustomers(Collection $records, bool $isAbandoned): int
    {
        return $records
            ->where('is_abandoned', $isAbandoned ? 1 : 0)
            ->pluck('userId')
            ->unique()
            ->count();
    }
}


