<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:43
 */

namespace App\Services\Trip;


use App\Constants\Balance\CompanyBalanceConst;
use App\Constants\Balance\CustomerBalanceConst;
use App\Constants\Push\PushActionConst;
use App\Constants\Push\PushConst;
use App\Constants\Push\PushTagConst;
use App\Constants\Trip\PaymentFormTypeConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\DriverConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\Balance\Balance;
use App\Models\Balance\BalanceFlow;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Company\CompanyWorkerRepository;
use App\Repositories\Log\LogRepository;
use App\Repositories\Realtime\MessagesChatTripRepository;
use App\Repositories\Realtime\TripRepository as RealtimeRepository;
use App\Repositories\Trip\TripPaymentFormRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\UserRepository;
use App\Utils\Push;
use App\Utils\RedisUtil;
use Illuminate\Support\Facades\Http;

class CancelTripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var MessagesChatTripRepository
     */
    private $messagesChatTripRepository;
    /**
     * @var RealtimeRepository
     */
    private $realtimeRepository;
    /**
     * @var LogRepository
     */
    private $logRepository;
    /**
     * @var TripPaymentFormRepository
     */
    private $tripPaymentFormRepository;
    /**
     * @var CustomerRepository
     */
    private $customerRepository;
    /**
     * @var CompanyWorkerRepository
     */
    private $companyWorkerRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var ConfigHelper
     */
    private $configHelper;
    /**
     * @var CentralRepository
     */
    private $centralRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;


    public function __construct(TripRepository             $repository,
                                MessagesChatTripRepository $messagesChatTripRepository,
                                RealtimeRepository         $realtimeRepository,
                                TripPaymentFormRepository  $tripPaymentFormRepository,
                                CustomerRepository         $customerRepository,
                                CompanyWorkerRepository    $companyWorkerRepository,
                                UserRepository             $userRepository,
                                ConfigHelper               $configHelper,
                                LogRepository              $logRepository,
                                CentralRepository          $centralRepository,
                                BalanceRepository          $balanceRepository)
    {
        $this->repository = $repository;
        $this->messagesChatTripRepository = $messagesChatTripRepository;
        $this->realtimeRepository = $realtimeRepository;
        $this->logRepository = $logRepository;
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
        $this->customerRepository = $customerRepository;
        $this->companyWorkerRepository = $companyWorkerRepository;
        $this->userRepository = $userRepository;
        $this->configHelper = $configHelper;
        $this->centralRepository = $centralRepository;
        $this->balanceRepository = $balanceRepository;
    }

    /**
     * @param $tripReference
     * @param User $user
     * @return Trip
     * @throws \Exception
     */
    public function cancel($tripReference, User $user, array $request)
    {
        try {
            \DB::beginTransaction();

            /** @var Trip $trip */
            $trip = $this->repository
                ->findByReference($tripReference, ['driver']);
            $this->updateTrip($trip, $request['callAgain'] ?? false);

            (new RedisUtil)->delete("trip-{$trip->tripReference}");

            $tripPaymentForm = $this->tripPaymentFormRepository->findById($trip['tripPaymentFormId']);

            if($tripPaymentForm['paymentFormTypeId'] == 11) {
                $this->refound($trip);
            };

            $driver = $this->putDriverAvailable($trip);
            $this->manageBalanceOnCancel($trip);

            \DB::commit();


            $resultRealtime = $this->removeRealtime($trip);

            $this->log([
                'resultRealtime' => $resultRealtime,
                'driver' => $driver ? $this->notifyDriverOnCancel($driver) : null,
                'trip' => $trip->toArray()
            ], $user['idUser'], $trip['tripReference']);

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $trip;
    }

    /**
     * @param User $trip
     * @throws \Exception
     */
    private function refound($trip)
    {
        $central = $this->centralRepository->findByResponsible($trip->userId);

        if(!$central) return;

        $centralBalance = $this->balanceRepository->findById($central['balanceId']);

        $update = $this->balanceRepository->setWithheldBalance(
            $centralBalance['idBalance'],
            ($centralBalance['tripBalance'] + $trip->price),
            ($centralBalance['withheldBalance'] - $trip->price)
        );

        if(!$update){
            throw new \Exception("Ocorreu um erro com o saldo em voucher");
        }
    }

    private function updateTrip(Trip &$trip, bool $callAgain = false)
    {
        $trip->status = !$trip->driverId ?
            TripConst::BACK_OFF :
            TripConst::CANCELED;

        $trip->endDate = now();
        $trip->canceledBy = TripConst::CANCELED_BY_ADMIN;
        $trip->callAgain = $callAgain;

        $trip->save();
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

    /**
     * @param Trip $trip
     * @return Driver|null
     */
    private function putDriverAvailable(Trip $trip): ?Driver
    {
        if (!$trip->driverId)
            return null;

        $currentTrips = $this->repository
            ->findCurrentByDriver($trip->driverId);

        $status = $currentTrips->isEmpty() ?
            DriverConst::AVAILABLE : DriverConst::IN_TRIP;

        if ($status == DriverConst::IN_TRIP &&
            $currentTrips->count() == 1 &&
            $currentTrips->first()->status == TripConst::PRE_ACCEPTED) {
            $this->repository
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

    private function manageBalanceOnCancel(Trip $trip): void
    {
        $tripPaymentForm = $trip->tripPaymentForm;

        switch ($tripPaymentForm->paymentFormTypeId) {
            case PaymentFormTypeConst::VOUCHER:
                $customer = $this->customerRepository
                    ->findByUser($trip->userId);

                $this->cancelPaymentByVoucher($trip, $customer->balance);
                break;
            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $companyWorker = $this->companyWorkerRepository
                    ->findByUser($trip->userId);

                $this->cancelPaymentByVoucher($trip, $companyWorker->company->balance, true);
                break;

            case PaymentFormTypeConst::CREDIT_CARD:
                $this->cancelPaymentByCreditCard($trip);
                break;
            // Estornar transações com cartão
        }
    }

    /**
     * @param Trip $trip
     * @param Balance $balance
     * @param bool $administrative
     * @return Balance
     */
    private function cancelPaymentByVoucher(Trip $trip, Balance $balance, $administrative = false): Balance
    {
        $value = $trip->price;

        $balance->tripBalance = ($value + $balance->tripBalance);
        $balance->withheldBalance = ($balance->withheldBalance - $value);

        if ($balance->withheldBalance < 0)
            $balance->withheldBalance = 0;

        $balance->save();

        $this->insertBalanceFlow(
            ($administrative ?
                CompanyBalanceConst::VOUCHER_RETURN_UNFINISHED_TRIP :
                CustomerBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION),
            $value,
            $balance->idBalance,
            $trip->tripReference
        );

        return $balance;
    }

    private function cancelPaymentByCreditCard(Trip $trip)
    {
        $response = exec("cd ../../api/console/ && php command.php trip-refund-card-payment {$trip->tripReference}");
        $responseWithoutNull = substr($response, 0, -4);
        return json_decode($responseWithoutNull);
    }

    /**
     * @param int $balanceFlowTypeId
     * @param float $value
     * @param int $balanceId
     * @param string|null $tripReference
     * @return BalanceFlow
     */
    private function insertBalanceFlow(
        int $balanceFlowTypeId, float $value, int $balanceId, ?string $tripReference = null): BalanceFlow
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->value = $value;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->balanceFlowTypeId = $balanceFlowTypeId;
        $balanceFlow->tripReference = $tripReference;
        $balanceFlow->save();

        return $balanceFlow;
    }

    /**
     * @param Driver $driver
     * @return array|null
     */
    private function notifyDriverOnCancel(Driver $driver): ?array
    {
        /** @var User $user */
        $user = $this->userRepository
            ->find($driver->userId);

        $title = $this->configHelper->get('app_title');

        $push = new Push;
        $push
            ->setTitle(strtoupper($title ?? 'CANCELAMENTO DE VIAGEM'))
            ->setBody('A viagem foi cancelada!')
            ->setAction(PushActionConst::OPEN_APP_DRIVER_CLOSE)
            ->setTag(PushTagConst::DRIVERS_CLOSE)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->sendNotificationWithData($user->deviceToken);
    }

    /**
     * @param $data
     * @param $user_id
     * @param $tripReference
     * @return \Illuminate\Database\Eloquent\Model|\Jenssegers\Mongodb\Eloquent\Builder|\Jenssegers\Mongodb\Eloquent\Model
     */
    private function log($data, $user_id, $tripReference)
    {
        return $this->logRepository
            ->insert(
                $data,
                "VIAGEM CANCELADA PELO MONITOR",
                $user_id,
                $tripReference
            );
    }
}
