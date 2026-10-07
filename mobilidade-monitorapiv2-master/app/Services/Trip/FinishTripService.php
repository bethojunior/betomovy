<?php


namespace App\Services\Trip;


use App\Constants\AppConst;
use App\Constants\Trip\TripAuditConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\DriverConst;
use App\Documents\Log;
use App\Exceptions\Trip\TripIsAlreadyFinishedException;
use App\Helpers\Trip\TripCardPaymentHelper;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Realtime\MessagesChatTripRepository;
use App\Repositories\Realtime\TripRepository as RealtimeRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\PartnerSplitTripPaymentService;
use App\Repositories\User\UserRepository;
use App\Services\Driver\DriverRewardTripService;
use App\Services\User\CustomerSplitTripPaymentService;
use App\Utils\DistanceUtil;
use App\Utils\RedisUtil;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FinishTripService
{
    private $tripRepository;
    private $messagesChatTripRepository;

    /**
     * @var RealtimeRepository
     */
    private $realtimeRepository;
    private $customerRepository;
    private $userRepository;
    private $partnerSplitTripPaymentService;
    private $customerSplitTripPaymentService;

    private $driverRewardTripService;
    private $userDiscountCouponService;
    private TripCardPaymentHelper $tripPaymentCardHelper;

    public function __construct(
        TripRepository $tripRepository,
        RealtimeRepository $realtimeRepository,
        CustomerRepository $customerRepository,
        UserRepository $userRepository,
        DriverRewardTripService $driverRewardTripService,
        PartnerSplitTripPaymentService $partnerSplitTripPaymentService,
        CustomerSplitTripPaymentService $customerSplitTripPaymentService,
        MessagesChatTripRepository $messagesChatTripRepository,
        UserDiscountCouponService $userDiscountCouponService,
        TripCardPaymentHelper $tripPaymentCardHelper
    )
    {
        $this->tripRepository = $tripRepository;
        $this->realtimeRepository = $realtimeRepository;
        $this->driverRewardTripService = $driverRewardTripService;
        $this->customerRepository = $customerRepository;
        $this->userRepository = $userRepository;
        $this->partnerSplitTripPaymentService = $partnerSplitTripPaymentService;
        $this->customerSplitTripPaymentService = $customerSplitTripPaymentService;
        $this->messagesChatTripRepository = $messagesChatTripRepository;
        $this->userDiscountCouponService = $userDiscountCouponService;
        $this->tripPaymentCardHelper = $tripPaymentCardHelper;
    }

    public function finish($tripReference)
    {
        /** @var Trip $trip */
        $trip = $this->tripRepository->findByReference($tripReference, ['driver']);

        if ($trip->status == TripConst::FINISHED) {
            throw new TripIsAlreadyFinishedException("Viagem já finalizada");
        }

        try {
            DB::beginTransaction();

            $trip->status = TripConst::FINISHED;
            $trip->endDate = Carbon::now();
            $trip->tripAuditId = $this->auditTrip($trip);

            $trip->save();

            $this->putAvailable($trip);

            $this->driverRewardTripService->toAwardDriver($trip, $trip->driver);

            $balances = $this->splitPayment($trip);

            $this->tripPaymentCardHelper->capturePaymentIfNeeded($trip);

            $this->userDiscountCouponService->useCoupon($trip);

            $trip->driver->balance = $balances['driverBalance'];

            DB::commit();

            (new RedisUtil)->delete("trip-{$trip->tripReference}");

            $this->createLog($trip);

            $this->removeRealtime($trip);
        } catch (\Throwable $exception) {
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

        return null;
    }

    /**
     * @param Trip $trip
     * @return Driver|null
     */
    public function putAvailable(Trip $trip): ?Driver
    {
        if (!$trip->driverId)
            return null;

        $currentTrips = $this->tripRepository
            ->findCurrentByDriver($trip->driverId);

        $status = $currentTrips->isEmpty() ?
            DriverConst::AVAILABLE : DriverConst::IN_TRIP;

        if ($status == DriverConst::IN_TRIP &&
            $currentTrips->count() == 1 &&
            $currentTrips->first()->status == TripConst::PRE_ACCEPTED) {
            $this->tripRepository
                ->updateStatusTrip($currentTrips->first()->tripReference, TripConst::ACCEPTED);

            $realtimeTrip = new RealtimeTrip;
            $realtimeTrip
                ->mount((object)$currentTrips->first()->toArray())
                ->setStatus(TripConst::ACCEPTED);

            $this->realtimeRepository
                ->setRealtime($realtimeTrip)
                ->save();
        }

        /** @var Driver $driver */
        $driver = $trip->driver;
        $driver->status = $status;
        $driver->preAvailable = 0;
        $driver->save();

        return $driver;
    }

    /**
     * @param $trip
     * @return int
     * @throws \Exception
     */
    public function auditTrip($trip)
    {
        $distance = $this->getDistanceByTripStatus($trip)['distance'];

        return $this->getTripAuditIdByDistance($distance);
    }

    /**
     * @param $trip
     * @return array
     * @throws \Exception
     */
    private function getDistanceByTripStatus($trip)
    {
        switch ($trip->status) {
            case TripConst::ACCEPTED:
                $distance = (new DistanceUtil(
                    $trip->driver->last_lat,
                    $trip->driver->last_lon,
                    $trip->origin->latitude,
                    $trip->origin->longitude
                ))->getDistance();

                return ['distance' => $distance, 'color' => 'green'];
            case TripConst::BOARDING:
                $distance = (new DistanceUtil(
                    $trip->driver->last_lat,
                    $trip->driver->last_lon,
                    $trip->origin->latitude,
                    $trip->origin->longitude
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
            case TripConst::IN_PROGRESS:
            case TripConst::FINISHED:
                $distance = (new DistanceUtil(
                    $trip->driver->last_lat,
                    $trip->driver->last_lon,
                    $trip->destination->latitude,
                    $trip->destination->longitude
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
            default :
                return null;
        }
    }

    private function getColorTimelineByDistance($distance)
    {
        if ($distance <= TripAuditConst::CLOSE_DISTANCE)
            return 'green';

        if ($distance > TripAuditConst::CLOSE_DISTANCE && $distance <= TripAuditConst::MEDIUM_DISTANCE)
            return 'orange';

        return 'red';
    }


    private function getTripAuditIdByDistance($distance)
    {
        if ($distance <= TripAuditConst::CLOSE_DISTANCE)
            return TripAuditConst::RELEASED;

        if ($distance > TripAuditConst::CLOSE_DISTANCE && $distance <= TripAuditConst::MEDIUM_DISTANCE)
            return TripAuditConst::IN_ANALYSIS;

        return TripAuditConst::BLOCKED;
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws \Exception
     */
    private function splitPayment(Trip $trip): array
    {
        $customer = $this->customerRepository->findByUser($trip->userId);

        if ($customer == null) {
            $customer = $this->userRepository->findWithBalance($trip->userId);
        }

        if ($customer) {
            return $this->splitPaymentInFinishCustomerTrip($trip, $customer);
        }

        throw new \Exception("Não é possível finalizar a viagem");
    }


    /**
     * @param Trip $trip
     * @param $customer
     * @return array
     * @throws \Exception
     */
    private function splitPaymentInFinishCustomerTrip(Trip $trip, $customer): array
    {
        $driver = $trip->driver;

        if ($trip->partnerCommissionId)
            $this->partnerSplitTripPaymentService->splitTripPayment($trip, $customer->balanceId, $trip->driver);

        return $this->customerSplitTripPaymentService
            ->splitTripPayment($trip, $customer->balanceId,$driver);
    }

    private function removeRealtime(Trip $trip)
    {
        $resultChatRealtime = $this->messagesChatTripRepository
            ->deleteByTripReference($trip->tripReference);

        $realtimeTrip = new RealtimeTrip;
        $realtimeTrip
            ->setDocumentId($trip->tripReference);

        $resultTripRealtime = $this->realtimeRepository
            ->setRealtime($realtimeTrip)
            ->delete();

        return compact('resultChatRealtime', 'resultTripRealtime');
    }

    private function createLog(Trip $trip): void
    {
        Log::create([
            'idReference' => $trip->tripReference,
            'userId'      => (string) $trip->userId,
            'app'         => AppConst::MONITOR,
            'message'     => 'VIAGEM FINALIZADA PELO MONITOR',
            'data'        => $trip->toArray()
        ]);
    }
}
