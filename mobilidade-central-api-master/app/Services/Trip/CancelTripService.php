<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:43
 */

namespace App\Services\Trip;



use App\Constants\Trip\TripConst;
use App\Contracts\Realtime\ChatRealtimeService;
use App\Contracts\Realtime\TripRealtimeService;
use App\Helpers\Driver\DriverHelper;
use App\Models\Trip\Trip;
use App\Models\User\User;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Log\LogRepository;
// use App\Repositories\Realtime\MessagesChatTripRepository;
// use App\Repositories\Realtime\TripRepository as RealtimeRepository;
use App\Repositories\Trip\TripPaymentFormRepository;
use App\Repositories\Trip\TripRepository;
use DateTime;
use Illuminate\Support\Facades\Log;

class CancelTripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var ChatRealtimeService
     */
    private $chatRealtimeService;
    /**
     * @var TripRealtimeService
     */
    private $tripRealtimeService;
    /**
     * @var DriverHelper
     */
    private $driverHelper;
    /**
     * @var LogRepository
     */
    private $logRepository;

    /**
     * @var TripPaymentFormRepository
     */
    private $tripPaymentFormRepository;

    public function __construct(
        TripRepository $repository,
        ChatRealtimeService $chatRealtimeService,
        TripRealtimeService $tripRealtimeService,
        LogRepository $logRepository,
        DriverHelper $driverHelper,
        TripPaymentFormRepository $tripPaymentFormRepository
    ) {
        $this->repository = $repository;
        $this->chatRealtimeService = $chatRealtimeService;
        $this->tripRealtimeService = $tripRealtimeService;
        $this->driverHelper = $driverHelper;
        $this->logRepository = $logRepository;
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
    }

    /**
     * @param $tripReference
     * @param User $user
     * @param null $status
     * @param string $scope 'this' cancela só a viagem informada; 'all' também
     *   cancela as demais viagens agendadas do mesmo lote (scheduledBatchId) —
     *   viagens já finalizadas/aceitas/canceladas do lote não são tocadas.
     * @return Trip
     * @throws \Exception
     */
    public function cancel($tripReference, User $user, $status = null, string $scope = 'this')
    {
        $trip = $this->cancelOne($tripReference, $user, $status);

        if ($scope === 'all' && $trip->scheduledBatchId) {
            $trip->setAttribute('groupCancel', $this->cancelGroupSiblings($trip, $user, $status));
        }

        return $trip;
    }

    /**
     * @param $tripReference
     * @param User $user
     * @param null $status
     * @return Trip
     * @throws \Exception
     */
    private function cancelOne($tripReference, User $user, $status = null)
    {
        try {
            \DB::beginTransaction();

            /** @var Trip $trip */
            $trip = $this->repository
                ->findByReference($tripReference, ['driver']);

            $paymentFormType = $this->tripPaymentFormRepository->findById($trip->tripPaymentFormId);

            if ($paymentFormType->paymentFormTypeId == 11 && !$trip->endDate) {
                $this->withheldBalance($trip['centralId'], $trip['price']);
            }

            $this->updateTrip($trip, $status);

            if ($trip->driverId)
                $this->driverHelper->putDriverAvailable($trip->driverId);

            \DB::commit();

            // Romove a chamada em tempo real
            $resultRealtime = $this->removeRealtime($trip);

            $this->log([
                'resultRealtime' => $resultRealtime,
                'trip' => $trip->toArray()
            ], $user->idUser, $trip->tripReference);
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $trip;
    }

    /**
     * @param Trip $trip
     * @param User $user
     * @param null $status
     * @return array{canceled: string[], failed: array{tripReference: string, error: string}[]}
     */
    private function cancelGroupSiblings(Trip $trip, User $user, $status = null): array
    {
        $siblings = $this->repository
            ->findEditableBatchSiblings($trip->scheduledBatchId, $trip->tripReference);

        $canceled = [];
        $failed = [];

        foreach ($siblings as $sibling) {
            try {
                $this->cancelOne($sibling->tripReference, $user, $status);
                $canceled[] = $sibling->tripReference;
            } catch (\Exception $e) {
                $failed[] = [
                    'tripReference' => $sibling->tripReference,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return compact('canceled', 'failed');
    }

    public function cancelByFlow($tripReference, $status = null)
    {
        try {
            \DB::beginTransaction();

            /** @var Trip $trip */
            $trip = $this->repository
                ->findByReference($tripReference, ['driver']);

            $paymentFormType = $this->tripPaymentFormRepository->findById($trip->tripPaymentFormId);

            if ($paymentFormType->paymentFormTypeId == 11 && !$trip->endDate) {
                $this->withheldBalance($trip['centralId'], $trip['price']);
            }

            $this->updateTrip($trip, $status);

            if ($trip->driverId)
                $this->driverHelper->putDriverAvailable($trip->driverId);

            \DB::commit();

            $resultRealtime = $this->removeRealtime($trip);
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $trip;
    }

    public function cancelWithLooping($tripReference, User $user, $status = null): void
    {
        $trip = $this->repository->findByReference($tripReference, ['tripType']);

        if ($trip && $trip->tripType->loopingOption == 0) {
            $this->cancel($tripReference, $user, $status);
        }
    }

    private function withheldBalance($centralId, $price)
    {
        $centralRepository = new CentralRepository();
        $balanceRepository = new BalanceRepository();

        $central = $centralRepository->find($centralId);

        $centralBalance = $balanceRepository->findById($central['balanceId']);

        $update = $balanceRepository->setWithheldBalance($centralBalance['idBalance'], ($centralBalance['tripBalance'] + $price), ($centralBalance['withheldBalance'] - $price));

        if (!$update) {
            throw new \Exception("Ocorreu um erro com o saldo em voucher");
        }
    }

    private function updateTrip(Trip &$trip, $status = null)
    {
        $trip->status = $trip->driverId ?
            TripConst::BACK_OFF :
            TripConst::CANCELED;

        $trip->endDate = now();
        $trip->canceledBy = TripConst::CANCELED_BY_CUSTOMER;

        if ($status) {
            $trip->status = $status;
            $trip->canceledBy = null;
        }

        $this->repository
            ->save($trip);
    }

    private function removeRealtime(Trip $trip)
    {
        $resultChatRealtime = $this->chatRealtimeService
            ->deleteMessagesByTripReference($trip->tripReference);

        $realtimeTrip = new RealtimeTrip;
        $realtimeTrip->setTripReference($trip->tripReference);

        $resultTripRealtime = $this->tripRealtimeService->delete($realtimeTrip);

        return compact('resultChatRealtime', 'resultTripRealtime');
    }

    private function log($data, $user_id, $tripReference)
    {
        try {
            return $this->logRepository
                ->insert(
                    $data,
                    "VIAGEM CANCELADA PELA CENTRAL",
                    $user_id,
                    $tripReference
                );
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
        }
    }
}
