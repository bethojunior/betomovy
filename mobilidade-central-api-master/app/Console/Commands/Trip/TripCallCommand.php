<?php

namespace App\Console\Commands\Trip;

use App\Constants\Trip\DriverCalledConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\DriverConst;
use App\Contracts\Realtime\TripRealtimeService;
use App\Helpers\Config\ConfigHelper;
use App\Models\Central\Central;
use App\Models\Config\Config;
use App\Models\Trip\TripDriver;
use App\Models\User\User;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Trip\DriverCalledRepository;
use App\Repositories\Trip\DriversCloseTheTripRepository;
use App\Repositories\Trip\TripDriverRepository;
use App\Repositories\Trip\TripHistoryRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\User\DriverRepository;
use App\Services\Trip\CancelTripService;
use App\Constants\Push\PushConst;
use App\Helpers\Trip\TripCallNotificationBuilder;
use App\Utils\Push;
use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;

class TripCallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trip:call {tripReference}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Realizar chamado de viagem';
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    private $tripCallConfig;
    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;
    /**
     * @var TripDriverRepository
     */
    private $tripDriverRepository;
    /**
     * @var TripRepository
     */
    private $tripRepository;
    /**
     * @var TripRealtimeService
     */
    private $tripRealtimeService;
    /**
     * @var Push
     */
    private $push;
    /**
     * @var DriversCloseTheTripRepository
     */
    private $driversCloseTheTripRepository;
    /**
     * @var CancelTripService
     */
    private $cancelTripService;
    /**
     * @var CentralRepository
     */
    private $centralRepository;
    /**
     * @var PulseProvider
     */
    private $pulseProvider;
    /**
     * @var TripCallNotificationBuilder
     */
    private $notificationBuilder;
    /**
     * Mensagem fallback usada quando a trip não tem price (mesma da api-php: Driver::MESSAGE_PUSH_NOTIFICATION).
     * @var string|null
     */
    private $pushFallbackMessage;
    /**
     * @var DriverRepository
     */
    private $driverRepository;
    /**
     * @var TripHistoryRepository
     */
    private $tripHistoryRepository;

    /**
     * Create a new command instance.
     *
     * @param ConfigHelper $configHelper
     * @param Push $push
     * @param DriverCalledRepository $driverCalledRepository
     * @param TripDriverRepository $tripDriverRepository
     * @param TripRepository $tripRepository
     * @param TripRealtimeService $tripRealtimeService
     * @param DriversCloseTheTripRepository $driversCloseTheTripRepository
     * @param CentralRepository $centralRepository
     * @param CancelTripService $cancelTripService
     * @param TripCallNotificationBuilder $notificationBuilder
     * @param DriverRepository $driverRepository
     * @param TripHistoryRepository $tripHistoryRepository
     */
    public function __construct(
        ConfigHelper $configHelper,
        Push $push,
        DriverCalledRepository $driverCalledRepository,
        TripDriverRepository $tripDriverRepository,
        TripRepository $tripRepository,
        TripRealtimeService $tripRealtimeService,
        DriversCloseTheTripRepository $driversCloseTheTripRepository,
        CentralRepository $centralRepository,
        CancelTripService $cancelTripService,
        TripCallNotificationBuilder $notificationBuilder,
        DriverRepository $driverRepository,
        TripHistoryRepository $tripHistoryRepository
    ) {
        parent::__construct();
        $this->configHelper = $configHelper;

        $this->driverCalledRepository = $driverCalledRepository;

        $this->tripDriverRepository = $tripDriverRepository;

        $this->tripRepository = $tripRepository;

        $this->tripRealtimeService = $tripRealtimeService;

        $this->push = $push;

        $this->driversCloseTheTripRepository = $driversCloseTheTripRepository;

        $this->cancelTripService = $cancelTripService;

        $this->centralRepository = $centralRepository;

        $this->driverRepository = $driverRepository;

        $this->tripHistoryRepository = $tripHistoryRepository;

        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'laravel'), GroupIds::CENTRAL_PROD);

        $this->notificationBuilder = $notificationBuilder;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     * @throws \Exception
     */
    public function handle()
    {
        $tripReference = $this->argument('tripReference');

        $this->tripCallConfig = $this->configHelper->get(
            'time_in_seconds_to_call_driver',
            'time_in_seconds_to_pass_driver_call',
            'not_answered_limit_to_turn_off_driver',
            'max_renew_list',
            'max_renew_all_drivers_list'
        );

        $this->mountPush();

        $timezone = Config::getConf('application_timezone');

        config(['app.timezone' => $timezone]);
        date_default_timezone_set($timezone);

        $this->callDriversOneByOne($tripReference);

        $this->comment(Inspiring::quote());
        return null;
    }

    /**
     * @param $tripReference
     * @throws \Exception
     */
    private function callDriversOneByOne($tripReference)
    {
        $drivers = $this->driverCalledRepository
            ->getByTrip($tripReference);

        if ($drivers->isEmpty()) {
            $this->pulseProvider->critical("Nenhum motorista encontrado para a viagem [$tripReference]", "App\Console\Commands\Trip\TripCallCommand");
        }

        $countRenews = 0;

        while ($drivers->isNotEmpty() && $countRenews <= ((int)$this->tripCallConfig['max_renew_list'])) {

            foreach ($drivers as $key => $driver) {

                $trip = $this->verifyTripIsSearching($tripReference);

                if (!$trip)
                    exit;

                $currentDriver = $this->driverRepository->find($driver->driverId, ['idDriver', 'status']);
                if (!$currentDriver || $currentDriver->status == DriverConst::OFF) {
                    continue;
                }

                $this->updateStatusOnCallTrip($tripReference, $driver->id, $driver->driverId);
                $trip->callingDriver = $driver->driverId;
                $trip->rand = rand();

                $this->tripHistoryRepository->insertTripsFound([$trip], $driver->driverId);

                $this->sendToRealtime($trip);

                $this->notify($key, $drivers->toArray(), $trip);

                $this->waitDriverAnswer($tripReference, $driver->id);

                /** tempo para chamar outro motorista */
                sleep((int)$this->tripCallConfig['time_in_seconds_to_pass_driver_call']);

                if ($this->checkStatusDriver($tripReference, $driver->id))
                    continue;

                $this->updateStatusOnNotAnsweredTrip($driver);
            }

            $trip = $this->verifyTripIsSearching($tripReference);

            $countRenews++;

            if ($trip && $countRenews > ((int)$this->tripCallConfig['max_renew_list'])) {
                sleep(5);
                $this->callAllDriversClose($tripReference, $trip->centralId);
            }

            if ($countRenews <= ((int)$this->tripCallConfig['max_renew_list']))
                $drivers = $trip ?
                    $this->renewListAllDrivers($tripReference, $trip->centralId) : collect();

            if ($drivers->isNotEmpty())
                $this->comment("Lista renovada" . PHP_EOL);
        }

        $trip = $this->verifyTripIsSearching($tripReference);

        if ($trip)
            $this->expireTrip($tripReference, $trip->userId);
    }

    /**
     * Verifica se a viagem ainda está ativa
     * @param $tripReference
     * @return array|bool|mixed
     */
    private function verifyTripIsSearching($tripReference)
    {
        $trip = $this->tripDriverRepository
            ->findByTripReference($tripReference);

        if (!$trip) {
            $this->pulseProvider->critical("Viagem [$tripReference] não encontrada ou já finalizada.", "App\Console\Commands\Trip\TripCallCommand");
            return false;
        }

        return $trip;
    }

    /**
     * Atualizando status do motorista chamado
     * e inserindo o motorista que está sendo chamado na trip
     * @param $tripReference
     * @param $driverCalledId
     * @param $driverId
     */
    private function updateStatusOnCallTrip($tripReference, $driverCalledId, $driverId)
    {
        $this->tripRepository
            ->updateByTripReference($tripReference, [
                'callingDriver' => $driverId
            ]);

        $this->driverCalledRepository
            ->updateById($driverCalledId, [
                'status' => DriverCalledConst::CALLING,
                'updated_at' => \Illuminate\Support\Facades\DB::raw('UTC_TIMESTAMP()'),
            ]);

        $this->pulseProvider->info("Status do motorista [$driverId] atualizado para CALLING", "App\Console\Commands\Trip\TripCallCommand");
    }

    /**
     * @param $trip
     * @param bool $callingNow
     * @return \App\Contracts\Repository\CloudFirestoreRepository|bool
     */
    private function sendToRealtime(TripDriver $trip, $callingNow = false)
    {
        $tripRealtime = new RealtimeTrip;
        $tripRealtime->mount((object)$trip->toArray());

        if ($callingNow) {
            $tripRealtime->setCallingAt(now());
        }

        $success = $this->tripRealtimeService->update($tripRealtime);

        if (!$success) {
            $this->pulseProvider->critical("Falha ao salvar a trip {$trip->tripReference} no Firebase", "App\Console\Commands\Trip\TripCallCommand");
        }

        return $success;
    }

    /**
     * Notifica o próximo motorista
     * para abrir o app
     * @param $key
     * @param array $drivers
     * @param $trip TripDriver|null trip atual, usada pra montar o additionalData do push
     * @return bool
     */
    private function notify($key, array $drivers, $trip = null)
    {
        $deviceTokens = array();

        if ($key == 0)
            $deviceTokens[] = $drivers[$key]['deviceToken'];

        if (isset($drivers[$key + 1]))
            $deviceTokens[] = $drivers[$key + 1]['deviceToken'];

        $deviceTokens = array_filter($deviceTokens);

        if (empty($deviceTokens)) {
            $this->pulseProvider->critical("Sem tokens para notificar motorista na posição $key", "App\Console\Commands\Trip\TripCallCommand");
            return false;
        }

        $proximityKm = isset($drivers[$key]['proximity']) ? (float)$drivers[$key]['proximity'] : null;
        $additionalData = $this->buildTripCallAdditionalData($trip, $proximityKm);

        $this->push
            ->setTitle($this->notificationBuilder->buildTitle())
            ->setBody($this->notificationBuilder->buildBody($trip, $proximityKm, $this->pushFallbackMessage))
            ->setAdditionalData($additionalData)
            ->notificationAllWithData($deviceTokens);

        return true;
    }

    /**
     * Monta o additionalData do push de chamado de corrida.
     * Mesmos parâmetros/unidades da mobilidade-api-php: estimatedTimeDriverArrival em
     * segundos, distanceDriverArrival em metros.
     * @param $trip TripDriver|null
     * @param float|null $proximityKm
     * @return array
     */
    private function buildTripCallAdditionalData($trip, ?float $proximityKm): array
    {
        return [
            'tripReference'              => $trip ? $trip->tripReference : null,
            'estimatedTimeDriverArrival' => $this->notificationBuilder->estimateArrivalSeconds($proximityKm),
            'distanceDriverArrival'      => $this->notificationBuilder->proximityMeters($proximityKm),
            'userId'                     => $trip ? $trip->userId : null,
            'tripCallTypeId'             => $trip ? $trip->tripCallTypeId : null,
        ];
    }

    /**
     * Percorre o tempo de chamada do motorista
     * @param $tripReference
     * @param $driverCalledId
     */
    private function waitDriverAnswer($tripReference, $driverCalledId)
    {
        $timeActual = 1;

        while ($timeActual < (int)$this->tripCallConfig['time_in_seconds_to_call_driver']) {

            $driver = $this->driverCalledRepository
                ->getStatusDriver($tripReference, $driverCalledId);

            if ($driver->status <> DriverCalledConst::CALLING)
                break;

            $this->comment(" chamando motorista " . $driver->driverId . " time: " . $timeActual . "\n");

            sleep(1);

            $timeActual++;
        }
    }

    /**
     * Retorna true se o motorista tiver aceitado uma corrida
     * @param $tripReference
     * @param $driverCalledId
     * @return bool
     */
    private function checkStatusDriver($tripReference, $driverCalledId)
    {
        $driver = $this->driverCalledRepository
            ->getStatusDriver($tripReference, $driverCalledId);

        if (
            $driver->status == DriverCalledConst::ACCEPTED ||
            $driver->status == DriverCalledConst::REFUSED
        )
            return $driver;

        return false;
    }

    /**
     * Atualiza status do motorista quando ele não atende
     * @param $driverCalled
     */
    private function updateStatusOnNotAnsweredTrip($driverCalled)
    {
        $this->driverCalledRepository
            ->updateById($driverCalled->id, [
                'status' => DriverCalledConst::NOT_ANSWERED,
                'updated_at' => \Illuminate\Support\Facades\DB::raw('UTC_TIMESTAMP()'),
            ]);

        $this->pulseProvider->info("Status do motorista [{$driverCalled->driverId}] atualizado para NOT_ANSWERED", "App\Console\Commands\Trip\TripCallCommand");
    }

    private function callAllDriversClose($tripReference, $centralId)
    {
        $drivers = $this->renewListAllDrivers($tripReference, $centralId);

        $countRenews = 0;

        $checkTrip = $this->verifyTripIsSearching($tripReference);

        while ($drivers->isNotEmpty() && $countRenews <= ((int)$this->tripCallConfig['max_renew_all_drivers_list'])) {

            $driversId = array_map(function ($driver) {
                return $driver['driverId'];
            }, $drivers->toArray());

            $driverCalledIds = array_map(function ($driver) {
                return $driver['id'];
            }, $drivers->toArray());

            // Reseta pra CALLING mesmo quem foi reaproveitado de uma rodada anterior
            // (senão fica com status antigo tipo not_answered e some do searchTrip).
            $this->driverCalledRepository
                ->updateManyStatusById($driverCalledIds, DriverCalledConst::CALLING);

            if ($checkTrip) {
                foreach ($driversId as $driverIdForHistory) {
                    $this->tripHistoryRepository->insertTripsFound([$checkTrip], $driverIdForHistory);
                }
            }

            $this->tripRepository
                ->updateByTripReference($tripReference, ['callingDriver' => implode(',', $driversId)]);

            if ($checkTrip) {
                $checkTrip->callingDriver = implode(',', $driversId);
                $checkTrip->rand = rand();
                $this->sendToRealtime($checkTrip);
            }

            foreach ($drivers->toArray() as $driver) {
                $proximityKm = isset($driver['proximity']) ? (float)$driver['proximity'] : null;
                $additionalData = $this->buildTripCallAdditionalData($checkTrip, $proximityKm);

                $this->push
                    ->setTitle($this->notificationBuilder->buildTitle())
                    ->setBody($this->notificationBuilder->buildBody($checkTrip, $proximityKm, $this->pushFallbackMessage))
                    ->setAdditionalData($additionalData)
                    ->notificationAllWithData([$driver['deviceToken']]);
            }

            $this->waitAllDriversAnswer($tripReference);

            $checkTrip = $this->verifyTripIsSearching($tripReference);

            if ($checkTrip) {
                $this->updateAllDriversStatusOnNotAnsweredTrip($driverCalledIds);
            }

            $drivers = $checkTrip ?
                $this->renewListAllDrivers($tripReference, $centralId) : collect();

            if ($drivers->isNotEmpty()) {
                sleep(5);
            }

            if ($checkTrip && $drivers->isEmpty()) {
                $checkTrip->callingDriver = null;
                $checkTrip->rand = rand();
                $this->sendToRealtime($checkTrip, true);
            }

            $countRenews++;
        }
    }

    private function renewListAllDrivers($tripReference, int $centralId)
    {
        /** @var Central $central */
        $central = $this->centralRepository
            ->find($centralId);

        $drivers = $this->driversCloseTheTripRepository
            ->findDriversClose($tripReference, $central);

        if ($drivers->isEmpty()) {
            $this->pulseProvider->critical("Nenhum motorista encontrado para a viagem [$tripReference] na renovação da listagem.", "App\Console\Commands\Trip\TripCallCommand");
        }

        // Mesmo padrão da api-php (DriverCalledService::renewListAllDrivers): reaproveita o
        // registro existente do motorista nessa trip em vez de criar um novo a cada renovação
        // (senão acumula N linhas pro mesmo driverId+tripReference).
        $existingByDriverId = [];
        foreach ($this->driverCalledRepository->getByTrip($tripReference) as $existing) {
            $existingByDriverId[$existing->driverId] = $existing;
        }

        return $drivers->map(function ($driver) use ($existingByDriverId) {
            $existing = $existingByDriverId[$driver->idDriver] ?? null;

            if ($existing && !in_array($existing->status, [DriverCalledConst::REFUSED, DriverCalledConst::ACCEPTED], true)) {
                $existing->deviceToken = $driver->deviceToken;
                return $existing;
            }

            $driverCalled = $this->driverCalledRepository
                ->create([
                    'driverId' => $driver->idDriver,
                    'tripReference' => $driver->tripReference,
                    'proximity' => $driver->proximity,
                    'destinationProximity' => $driver->destinationProximity,
                    'status' => DriverCalledConst::CALLING,
                ]);

            $driverCalled->deviceToken = $driver->deviceToken;

            return $driverCalled;
        });
    }

    private function waitAllDriversAnswer($tripReference)
    {
        $timeActual = 1;

        while ($timeActual < (int)$this->tripCallConfig['time_in_seconds_to_call_driver']) {

            $drivers = $this->driverCalledRepository
                ->getStatusAllDrivers($tripReference);

            $stop = false;

            foreach ($drivers as $driver) {
                if ($driver->status == DriverCalledConst::ACCEPTED) {
                    $stop = true;
                    break;
                }
            }

            if ($stop)
                break;

            $this->comment(" chamando motoristas. Time: " . $timeActual . "\n");

            sleep(1);

            $timeActual++;
        }
    }

    /**
     * Atualiza status do motorista quando ele não atende
     * @param array $driverCalledIds
     */
    private function updateAllDriversStatusOnNotAnsweredTrip(array $driverCalledIds)
    {
        $this->driverCalledRepository
            ->updateManyStatusById($driverCalledIds, DriverCalledConst::NOT_ANSWERED);
    }

    /**
     * @param $tripReference
     * @param $userId
     * @throws \Exception
     */
    private function expireTrip($tripReference, $userId)
    {
        $this->cancelTripService->cancel(
            $tripReference,
            new User(['idUser' => $userId]),
            TripConst::NOT_ANSWERED
        );

        $this->comment("Chamada Expirada");
    }

    private function mountPush()
    {
        $this->pushFallbackMessage = PushConst::TRIP_CALL_FALLBACK_MESSAGE;

        $this->push
            ->setAction(PushConst::OPEN_APP_ACTION)
            ->setTag(PushConst::RIDE_REQUEST_TAG)
            ->setCollapseId(PushConst::RIDE_REQUEST_TAG)
            ->setCategoryId(PushConst::TRIP_CALL_CATEGORY_ID)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setIcon(PushConst::TRIP_CALL_ICON)
            ->setSoundname(PushConst::TRIP_CALL_SOUND);
    }
}
