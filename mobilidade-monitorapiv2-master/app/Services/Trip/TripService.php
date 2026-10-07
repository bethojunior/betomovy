<?php

/**
 * Created by PhpStorm.
 * Date: 14/06/2019
 * Time: 16:10
 */

namespace App\Services\Trip;


use App\Constants\AppConst;
use App\Constants\Balance\DriverBalanceConst;
use App\Constants\Trip\TripAuditConst;
use App\Constants\Users\PartnerBalanceConst;
use App\Documents\Log;
use App\Models\Balance\Balance;
use App\Models\Balance\BalanceFlow;
use App\Models\Config\CityConfig;
use App\Models\Config\Config;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Trip\TripEventRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\TripSummaryViewRepository;
use App\Services\Trip\TripProgressCalculator;
use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var TripSummaryViewRepository
     */
    private $viewRepository;
    /**
     * @var TripEventRepository
     */
    private $tripEventRepository;

    public function __construct(
        TripRepository            $repository,
        TripSummaryViewRepository $viewRepository,
        TripEventRepository       $tripEventRepository
    ) {
        $this->repository = $repository;
        $this->viewRepository = $viewRepository;
        $this->tripEventRepository = $tripEventRepository;
    }

    public function findAll(array $request = [], int $userId = null, int $cityId = null)
    {
        $trips = $this->repository->findAll($request, $userId, $cityId);

        $data = (object)[
            'trips' => $trips,
        ];

        $this->transformDataTrip($trips, $cityId);

        if (isset($request['withTotalValue']) && $request['withTotalValue']) {
            $data->totalValue = $this->repository->totalValue($request, $userId, $cityId);
        }

        return $data;
    }

    public function transformDataTrip($trips, $cityId)
    {
        $cityConfig = null;
        if ($cityId) {
            $cityConfig = CityConfig::getConf($cityId);
        }
        $configTimeZone = Config::getConf('application_timezone');

        foreach ($trips as &$trip) {
            $date = new DateTime($trip->date);
            $date->modify('+3 hours');

            if ($cityConfig->timezone) {
                $timezone = new DateTimeZone($cityConfig->timezone);
            } else {
                $timezone = new DateTimeZone($configTimeZone);
            };

            $offsetSeconds = $timezone->getOffset(new DateTime('now'));
            $offsetHours = abs($offsetSeconds / 3600);

            if ($offsetHours < 0) {
                $date->modify("+ $offsetHours hours");
            } else {
                $date->modify("- $offsetHours hours");
            }
            $trip->date = $date->format("Y-m-d H:i:s e");
        }
    }

    public function findWay(string $tripReference)
    {
        return $this->repository->findWay($tripReference);
    }

    public function findInAnalysis(array $request = [], int $cityId = null)
    {
        return $this->repository->findInAnalysis(Auth::user(), $request, $cityId);
    }

    public function actives($centralId)
    {
        $trips = $this->viewRepository
            ->findActivesByCentral($centralId);

        return $trips;
    }

    public function find($tripReference)
    {
        $trip = $this->repository
            ->findFully($tripReference);

        //        $trip = $this->viewRepository
        //            ->findFully($tripReference);

        $trip
            ->delivery_info = $trip->delivery_info ?? null;
        $trip
            ->freight_items = $trip->freight_items ?? [];
        $trip
            ->accessibility = $trip->accessibility ?? null;

        $trip->events = $this->tripEventRepository->findTripEvents($tripReference);
        $trip->tripProgress = TripProgressCalculator::calculate($trip);
        $this->attachFareFeeValues($trip);

        return $trip;
    }

    // Calcula tax_price/another_fee/taxes já em R$, mesma base da api-php (PriceService::calculatePrice)
    private function attachFareFeeValues($trip): void
    {
        $fare = $trip->fare;
        if (!$fare) {
            return;
        }

        $feeBase = (float) $fare->base_price
            + (float) $fare->km_price * (float) $trip->distance
            + (float) $fare->minute_price * (float) $trip->estimatedTripTime;

        $calculateFeeValue = fn ($value, $type) => $type === '%' ? $feeBase * (float) $value / 100 : (float) $value;

        $fare->tax_price_value = round($calculateFeeValue($fare->tax_price, $fare->tax_price_type), 2);
        $fare->another_fee_value = round($calculateFeeValue($fare->another_fee, $fare->another_fee_type), 2);

        foreach ($trip->taxes ?? [] as $tax) {
            $tax->chargedValue = round($calculateFeeValue($tax->value, $tax->valueType), 2);
        }
    }
    public function findRideTrip($tripReference)
    {
        $trip = $this->repository
            ->findFullyRideTrip($tripReference);

        foreach ($trip->ride->riders as $rider) {
            $rider->valuePerSeat = $rider->valuePerSeat / $trip->ride->riders->count();
        }

        $trip->events = $this->tripEventRepository->findTripEvents($tripReference);
        $this->attachFareFeeValues($trip);

        return $trip;
    }

    public function release(string $tripReference = null): array
    {
        $balanceFlows = (new BalanceFlowRepository())->getBlockedFlowsTrip($tripReference);
        DB::beginTransaction();

        try {
            $balanceFlows->map(function (BalanceFlow $balanceFlow) use ($tripReference) {
                $this->manageBalanceFlowOnReleaseTrip($balanceFlow, is_null($tripReference));
            });

            $trips = array_column($balanceFlows->toArray(), 'tripReference');

            if ($tripReference) {
                $trips[] = $tripReference;
            }

            $this->repository->updateTripAudit(TripAuditConst::RELEASED_AFTER_ANALYSIS, $trips);

            DB::commit();
            return array_unique($trips);
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::create([
                'idReference' => $trip->tripReference ?? auth()->id(),
                'userId'      => (string) ($trip->userId ?? auth()->id()),
                'app'         => AppConst::MONITOR,
                'message'     => $exception->getMessage(),
                'data'        => [
                    'exception' => $exception->getTrace(),
                    'trip'      => $trip->toArray()
                ]
            ]);
            throw $exception;
        }
    }

    private function manageBalanceFlowOnReleaseTrip(BalanceFlow $balanceFlow, bool $resetBlockedBalance = false): BalanceFlow
    {
        $balanceFlowTypeAddList = [
            DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS => DriverBalanceConst::BALANCE_ENTRY_BY_TRIP,
            DriverBalanceConst::REWARD_TRIP_BLOCKED => DriverBalanceConst::REWARD_TRIP,
            DriverBalanceConst::BONUS_MONETIZATION_BLOCKED => DriverBalanceConst::BONUS_MONETIZATION,
            DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE_IN_ANALYSIS => DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE,
            PartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR_ANALYSIS => PartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR,
            PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS => PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP,
            DriverBalanceConst::BLOCKED_ENTRY_DYNAMIC_TAX => DriverBalanceConst::ENTRY_DYNAMIC_TAX,
        ];

        $balanceFlowTypeSubList = [
            DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS => DriverBalanceConst::BALANCE_OUT_COMMISSIONS,
            DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS => DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM,
            DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE_IN_ANALYSIS => DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE,
            DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION_IN_ANALYSIS => DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION,
            DriverBalanceConst::BLOCKED_EXIT_DYNAMIC_TAX => DriverBalanceConst::EXIT_DYNAMIC_TAX,
        ];

        if (isset($balanceFlowTypeAddList[$balanceFlow->balanceFlowTypeId])) {
            $balanceFlow->balanceFlowTypeId = $balanceFlowTypeAddList[$balanceFlow->balanceFlowTypeId];
            $balanceFlow->save();
            $this->addBalance($balanceFlow->balance, $balanceFlow->value, $resetBlockedBalance);

            return $balanceFlow;
        }
        $balanceFlow->balanceFlowTypeId = $balanceFlowTypeSubList[$balanceFlow->balanceFlowTypeId];
        $balanceFlow->save();

        $this->subBalance($balanceFlow->balance, $balanceFlow->value, $resetBlockedBalance);

        return $balanceFlow;
    }

    private function addBalance(Balance $balance, float $value, bool $resetBlockedBalance = false): Balance
    {
        $balance->blockedBalance =
            !$resetBlockedBalance ? round($balance->blockedBalance - $value, 2) : 0;
        $balance->balance += $value;
        $balance->save();

        return $balance;
    }

    private function subBalance(Balance $balance, float $value, bool $resetBlockedBalance = false): Balance
    {
        $balance->blockedBalanceToPay =
            !$resetBlockedBalance ? round($balance->blockedBalanceToPay - $value, 2) : 0;
        $balance->balance -= $value;
        $balance->save();

        return $balance;
    }

    public function findAllScheduled(array $request = [], int $userId = null, int $cityId = null)
    {
        $trips = $this->repository->findAllScheduled($request, $userId, $cityId);

        return (object)[
            'trips' => $trips,
        ];
    }

    public function getFinancialMirror($request, $cityId)
    {
        if (!isset($request['analizy']) || $request['analizy'] == 0) {
            $trips = $this->repository->getTrips(
                $request['startDate'],
                $request['endDate'],
                $request['driverId'] ?? null,
                $request['userId'] ?? null,
                $cityId ?? null,
                $request['isToday'] ?? false,
                $request['status'] ?? null
            );
        } else {
            $trips = $this->repository->findInAnalysis(Auth::user(), [], $cityId);
        }

        return $this->mountFinacialMirror($trips);
    }

    private function mountFinacialMirror($trips)
    {
        $allTrips = 0;
        $finishedTrips = 0;
        $totalPrice = 0;
        $canceledByCustomer = 0;
        $canceledByDriver = 0;
        $cardRefused = 0;
        $uniqueUserIds = [];
        $uniqueDriverIds = [];
        $userIdCounts = [];

        foreach ($trips as $trip) {
            $userId = $trip->userId;
            $driverId = $trip->driverId;

            if (isset($userIdCounts[$userId])) {
                $userIdCounts[$userId]++;
            } else {
                $userIdCounts[$userId] = 1;
            }

            if (!in_array($userId, $uniqueUserIds)) {
                $uniqueUserIds[] = $userId;
            }

            if (!in_array($driverId, $uniqueDriverIds)) {
                $uniqueDriverIds[] = $driverId;
            }

            if ($trip->canceledBy == "customer") {
                $canceledByCustomer++;
            }
            if ($trip->canceledBy == "driver") {
                $canceledByDriver++;
            }
            if ($trip->status == "payment_refused") {
                $cardRefused++;
            }
            if ($trip->status == "finished") {
                $finishedTrips++;
                $totalPrice += $trip->price;
            }
            $allTrips++;
        }

        $usersWithOneData = 0;
        foreach ($userIdCounts as $count) {
            if ($count === 1) {
                $usersWithOneData++;
            }
        }

        $numUniqueUsers = count($uniqueUserIds);
        $uniqueDriverIds = count($uniqueDriverIds);

        $totalPrice = number_format($totalPrice, 2);

        $filtered = [
            'totalTrips' => $allTrips,
            'finishedTrips' => $finishedTrips,
            'totalPrice' => $totalPrice,
            'canceledByCustomer' => $canceledByCustomer,
            'canceledByDriver' => $canceledByDriver,
            'cardRefused' => $cardRefused,
            'numUniqueCustomer' => $numUniqueUsers,
            'uniqueDriverIds' => $uniqueDriverIds,
            'firstTrip' => $usersWithOneData
        ];

        return $filtered;
    }

    public function totalBilled($cityId)
    {
        $finishedTrips = 0;
        $totalPrice = 0;
        $trips = $this->repository->getTrips(
            today(),
            today(),
            null,
            null,
            $cityId,
            true
        );

        foreach ($trips as $trip) {
            if ($trip->status == "finished") {
                $finishedTrips++;
                $totalPrice += $trip->price;
            }
        }

        $totalPrice = number_format($totalPrice, 2);

        return $totalPrice;
    }

    public function findCurrentByDriver($driverId)
    {
        return $this->repository->findCurrentByDriverId($driverId, false);
    }

    public function findOneByPlate($plate)
    {
        return $this->repository->findCurrentByDriverId('', $plate);
    }
}
