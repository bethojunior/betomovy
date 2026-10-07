<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 16:37
 */

namespace App\Services\Trip;


use App\Constants\Trip\DriverCalledConst;
use App\Constants\Trip\RewardTripTypeConst;
use App\Constants\Trip\TripCallTypeConst;
use App\Constants\Trip\TripConst;
use App\Contracts\Exception\CustomException;
use App\Contracts\Realtime\TripRealtimeService;
use App\Events\MobilityLite\NewTripEventMobilityLite;
use App\Events\TripDriverNotificationWpp;
use App\Events\TripGroupNotificationWpp;
use App\Exceptions\Trip\DriverCommissionException;
use App\Exceptions\Trip\DriverTripTypeException;
use App\Exceptions\Trip\ZoneException;
use App\Models\Central\Central;
use App\Models\Central\CentralTripInfoResponse;
use App\Models\Central\TripCentralFee;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;
use App\Models\Locale\City;
use App\Models\Trip\DeliveryInfo;
use App\Models\Trip\PartnerCommission;
use App\Models\Trip\RewardCampaignTrip;
use App\Models\Trip\Trip;
use App\Models\Trip\TripItem;
use App\Models\Trip\TripType;
use App\Models\Trip\TripWayPoint;
use App\Models\User\User;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralCustomerRepository;
use App\Repositories\Central\CentralFeeRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Locale\CityRepository;
use App\Repositories\Log\LogRepository;
// use App\Repositories\Realtime\TripRepository as RealtimeTripRepository;
use App\Repositories\Tax\TaxRepository;
use App\Repositories\Trip\DestinationRepository;
use App\Repositories\Trip\DriverCalledRepository;
use App\Repositories\Trip\DriverCommissionRepository;
use App\Repositories\Trip\DriversCloseTheTripRepository;
use App\Repositories\Trip\OriginRepository;
use App\Repositories\Trip\PartnerCommissionRepository;
use App\Repositories\Trip\TripPaymentFormRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\TripScheduledRepository;
use App\Repositories\Trip\ZoneRepository;
use App\Repositories\TripTax\TripTaxRepository;
use App\Repositories\User\DriverRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class NewTripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var DriverCommissionRepository
     */
    private $driverCommissionRepository;
    /**
     * @var ZoneRepository
     */
    private $zoneRepository;
    /**
     * @var DriversCloseTheTripRepository
     */
    private $driversCloseTheTripRepository;
    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;
    /**
     * @var OriginRepository
     */
    private $originRepository;
    /**
     * @var DestinationRepository
     */
    private $destinationRepository;
    /**
     * @var TripRealtimeService
     */
    private $tripRealtimeService;
    /**
     * @var CentralCustomerRepository
     */
    private $centralCustomerRepository;
    /**
     * @var LogRepository
     */
    private $logRepository;
    /**
     * @var CityRepository
     */
    private $cityRepository;
    /**
     * @var PartnerCommissionRepository
     */
    private $partnerCommissionRepository;
    /**
     * @var CentralRepository
     */
    private $centralRepository;

    private $centralFeeRepository;

    /**
     * @var TripPaymentFormRepository
     */
    private $tripPaymentFormRepository;

    /**
     * @var TripScheduledRepository
     */
    private $tripScheduledRepository;

    /**
     * @var PulseProvider
     */
    private $pulseProvider;

    /**
     * @var DriverRepository
     */
    private $driverRepository;

    public function __construct(
        TripRepository $repository,
        DriverCommissionRepository $driverCommissionRepository,
        PartnerCommissionRepository $partnerCommissionRepository,
        ZoneRepository $zoneRepository,
        DriversCloseTheTripRepository $driversCloseTheTripRepository,
        DriverCalledRepository $driverCalledRepository,
        OriginRepository $originRepository,
        DestinationRepository $destinationRepository,
        CentralCustomerRepository $centralCustomerRepository,
        TripRealtimeService $tripRealtimeService,
        CityRepository $cityRepository,
        LogRepository $logRepository,
        CentralRepository $centralRepository,
        CentralFeeRepository $centralFeeRepository,
        TripPaymentFormRepository $tripPaymentFormRepository,
        TripScheduledRepository $tripScheduledRepository,
        DriverRepository $driverRepository
    ) {
        $this->repository = $repository;
        $this->driverCommissionRepository = $driverCommissionRepository;
        $this->partnerCommissionRepository = $partnerCommissionRepository;
        $this->zoneRepository = $zoneRepository;
        $this->driversCloseTheTripRepository = $driversCloseTheTripRepository;
        $this->driverCalledRepository = $driverCalledRepository;
        $this->originRepository = $originRepository;
        $this->destinationRepository = $destinationRepository;
        $this->tripRealtimeService = $tripRealtimeService;
        $this->centralCustomerRepository = $centralCustomerRepository;
        $this->logRepository = $logRepository;
        $this->cityRepository = $cityRepository;
        $this->centralRepository = $centralRepository;
        $this->centralFeeRepository = $centralFeeRepository;
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
        $this->tripScheduledRepository = $tripScheduledRepository;
        $this->driverRepository = $driverRepository;
        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'laravel'), GroupIds::CENTRAL_PROD);
    }

    /**
     * @param $request
     * @param User $user
     * @param bool $cache
     * @param array|null $sharedContext Dados já resolvidos por
     *   resolveSharedBatchContext(), reaproveitados entre as viagens de um
     *   mesmo lote (mesma origem/destino/cidade/tipo de viagem) — evita
     *   repetir as mesmas consultas/inserts a cada viagem do lote.
     * @return Trip
     * @throws CustomException
     * @throws \Exception
     */
    public function newTrip($request, User $user, $cache = true, ?array $sharedContext = null)
    {
        try {
            \DB::beginTransaction();

            //todo: adicionar tripReference no cacheKey para valdiar em chamadas para evitar chamadas duplicadas
            $cacheKey = 'trip_request_' . md5(
                ($request['origin']['latitude'] ?? '') .
                    ($request['origin']['longitude'] ?? '') .
                    ($request['destination']['latitude'] ?? '') .
                    ($request['destination']['longitude'] ?? '') .
                    ($request['userId'] ?? '')
            );

            $cachedTrip = Cache::get($cacheKey); //adicionar tempo de expiração de 10 segundos

            // se a viagem for diferente de TripConst::NOT_ANSWERED || TripConst::CANCELED || TripConst::FINISHED ela pode ser solicitada novamente
            // todo: validar o status da tripReference para ver se bloqueia nova solicitação {em um periodo de 10 segundos}
            // if ($cachedTrip) {
            //     throw new CustomException('Aguarde um momento para solicitar uma nova viagem');
            // }

            $paidByCentral = isset($request['paidByCentral']) && $request['paidByCentral'];
            $paymentFormType = $this->tripPaymentFormRepository->findById($request['tripPaymentFormId']);

            if ($paymentFormType->paymentFormTypeId == 11) {
                $this->withheldBalance($request['centralId'], $request['price']);
            }

            $trip = $this->startTrip($request, $user->idUser, $sharedContext);

            $isScheduled = isset($request['schedule']) && !empty($request['schedule']);

            if ($isScheduled) {
                $this->pulseProvider->info("Agendando viagem [{$trip->tripReference}] para [{$request['schedule']}]", self::class);

                $this->scheduleTrip(
                    $trip->tripReference,
                    $request['schedule'],
                    $request['scheduleUTC'] ?? null
                );

                $this->repository->updateByTripReference($trip->tripReference, [
                    'status' => TripConst::SCHEDULED
                ]);
            }

            if (!empty($request['questions']) && count($request['questions']) > 0) {
                $this->createResponseQuestion($request['questions'], $trip->tripReference);
            }

            if (isset($request['waypoints']) && !empty($request['waypoints']))
                $waypoint = $this->tripWayPoints($trip, $request['waypoints']);

            if (isset($request['deliveryInfo']))
                $this->createDeliveryInfo($trip, $request['deliveryInfo']);

            if (isset($request['tripItems']))
                $this->createTripItems($trip, $request['tripItems']);

            if ((bool) $trip->haveReturn && !$paidByCentral)
                $this->checkCentralFee($trip);

            /** @var Trip $trip */
            $trip = $this->repository->findFully($trip->tripReference, [
                'driverCommission',
                'partnerCommission',
                'zone',
                'deliveryInfo',
                'tripItems',
            ]);

            $this->createTripTaxes($trip->idTrip, $trip->cityId, $request['tripTypeId'], $request['taxes'] ?? [], $sharedContext['remainingTaxIds'] ?? null);

            $resultRealtime = $this->sendToRealtime($trip);

            // Agendada: motorista só é chamado perto do horário marcado, não na criação.
            $driversClose = $isScheduled ? collect() : $this->callDriversClose($trip, $request['centralId']);

            $this->log([
                'trip' => $trip->toArray(),
                'realtime' => $resultRealtime,
                'driversClose' => $driversClose->toArray()
            ], $user->idUser, $trip->tripReference);

            if ($isScheduled) {
                $this->pulseProvider->info("Chamada de motoristas adiada — viagem agendada [{$trip->tripReference}]", self::class);
            } else {
                artisanBackgroundTask('trip:call ' . $trip->tripReference);
            }

            $tripParamsMobilityLite = [
                'appName' => env('APP_NAME'),
                'tripReference' => $trip->tripReference,
                'price' => floatval($trip->price),
                'distance' => floatval($request['distance']),
                'tripTime' => floatval($request['estimatedTripTime']),

                'drivers' => $driversClose->toArray() ?? [],
                'tripWayPoints' => $waypoint ?? [],

                'origin' => [
                    'latitude' => $request['origin']['latitude'],
                    'longitude' => $request['origin']['longitude'],
                    'address' => $request['origin']['address'],
                ],

                'destination' => [
                    'latitude' => $request['destination']['latitude'],
                    'longitude' => $request['destination']['longitude'],
                    'address' => $request['destination']['address'],
                ],
                'customer' => [
                    'name' => $request['tripCustomer']['name'] ?? '',
                    'phone' => $request['tripCustomer']['phone'] ?? ''
                ]
            ];

            Log::info('🔥 params', [
                'payload' => $tripParamsMobilityLite
            ]);

            Cache::put($cacheKey, $trip, 10); // cache por 10 segundos para evitar chamadas duplicadas
            app(TripGroupNotificationWpp::class)->handle($request['centralId']);
            event(new NewTripEventMobilityLite($tripParamsMobilityLite));

            \DB::commit();
        } catch (CustomException $e) {
            \DB::rollBack();

            throw $e;
        }

        return $trip;
    }

    private function withheldBalance($centralId, $price)
    {
        $balanceRepository = new BalanceRepository();
        $centralRepository = new CentralRepository();

        $central = $centralRepository->find($centralId);

        $centralBalance = $balanceRepository->findById($central->balanceId);

        $update = $balanceRepository->setWithheldBalance($centralBalance->idBalance, ($centralBalance->tripBalance - $price), ($price + $centralBalance->withheldBalance));

        if (!$update) {
            throw new \Exception("Ocorreu um erro com o saldo em voucher");
        }
    }

    private function checkCentralFee(Trip &$trip)
    {
        $centralFee = $this->centralFeeRepository->findActive();

        if ($centralFee) {
            $tripCentralFee = new TripCentralFee();

            $tripCentralFee->tripId = $trip->idTrip;
            $tripCentralFee->centralFeeId = $centralFee->id;

            $tripCentralFee->save();

            if ($centralFee->returnFee > 0) {
                $rewardCampaignTrip = new RewardCampaignTrip();
                $rewardCampaignTrip->value = $centralFee->isByKm ? $centralFee->returnFee * $trip->distance : $centralFee->returnFee;
                $rewardCampaignTrip->tripReference = $trip->tripReference;
                $rewardCampaignTrip->rewardTripTypeId = RewardTripTypeConst::REWARD_RETURN_FEE_CENTRAL;

                $rewardCampaignTrip->save();
            }
        }
    }

    public function findFeeTrip()
    {
        return $this->centralFeeRepository->findActive();
    }

    /**
     * @param $request
     * @param $userId
     * @param array|null $sharedContext ver newTrip()
     * @return Trip
     * @throws DriverCommissionException
     * @throws DriverTripTypeException
     * @throws ZoneException
     */
    private function startTrip($request, $userId, ?array $sharedContext = null)
    {
        /** @var City $city */
        $city = $sharedContext['city'] ?? $this->cityRepository
            ->findByCoordinate($request['origin']['latitude'], $request['origin']['longitude']);

        $trip = new Trip($request);
        $trip->userId = $userId;
        if (isset($request['isOpenPriceTrip']) && $request['isOpenPriceTrip'] == true) {
            $trip->tripCallTypeId = TripCallTypeConst::TAXIMETER;
        } else {
            $trip->tripCallTypeId = TripCallTypeConst::CENTRAL_CALL;
        }
        $trip->cityId = $city->id;

        if (isset($request['favoriteDrivers'])) {
            $isScheduled = isset($request['schedule']) && !empty($request['schedule']);

            if ($isScheduled && !empty($request['favoriteDrivers'])) {
                $this->validateFavoriteDriversTripType($request['favoriteDrivers'], $request['tripTypeId']);
            }

            $trip->favoriteDrivers = implode(',', $request['favoriteDrivers']);
        }

        $trip
            ->centralCustomer()
            ->associate(
                $this->findOrCreateCustomer(
                    $request['tripCustomer'],
                    $request['centralId']
                )
            );

        $trip
            ->origin()
            ->associate(
                $sharedContext['origin'] ?? $this->originRepository
                    ->create($request['origin'])
            );

        $trip
            ->destination()
            ->associate(
                $sharedContext['destination'] ?? $this->destinationRepository
                    ->create($request['destination'])
            );

        $trip
            ->driverCommission()
            ->associate(
                $sharedContext['driverCommission'] ?? $this->findDriverCommission(
                    $city->id,
                    $request['tripTypeId']
                )
            );

        $partnerCommission = $sharedContext['partnerCommission'] ?? $this->findPartnerCommission($city->id, $request['tripTypeId']);
        if ($partnerCommission)
            $trip
                ->partnerCommission()
                ->associate($partnerCommission);

        $trip
            ->zone()
            ->associate(
                $sharedContext['zone'] ?? $this->findZone($city->id)
            );

        $trip->save();

        return $trip;
    }

    /**
     * @param $request
     * @param $centralId
     * @return CentralCustomerRepository|CentralCustomerRepository[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed|null
     */
    private function findOrCreateCustomer($request, $centralId)
    {
        if (isset($request['id'])) {
            $centralCustomer = $this->centralCustomerRepository->find($request['id']);
        } elseif (isset($request['userId'])) {
            $centralCustomer = $this->centralCustomerRepository
                ->findByUserAndCentral($request['userId'], $centralId);
        }

        $request = array_merge($request, compact('centralId'));

        $centralCustomer = $centralCustomer ?? $this->centralCustomerRepository
            ->create($request);

        return $centralCustomer;
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @return DriverCommissionRepository|\Illuminate\Database\Eloquent\Model|null|object
     * @throws DriverCommissionException
     */
    private function findDriverCommission($cityId, $tripTypeId)
    {
        $driverCommission = $this->driverCommissionRepository
            ->findByCityAndTripType($cityId, $tripTypeId);

        if (!$driverCommission)
            throw new DriverCommissionException("Comissão do motorista não encontrada");

        return $driverCommission;
    }

    /**
     * @param int $cityId
     * @param int $tripTypeId
     * @return PartnerCommission|null
     */
    private function findPartnerCommission(int $cityId, int $tripTypeId): ?PartnerCommission
    {
        /** @var null|PartnerCommission $partnerCommission */
        $partnerCommission = $this->partnerCommissionRepository
            ->findByCityAndTripType($cityId, $tripTypeId);

        return $partnerCommission;
    }

    /**
     * @param $cityId
     * @return ZoneRepository|\Illuminate\Database\Eloquent\Model|null|object
     * @throws ZoneException
     */
    private function findZone($cityId)
    {
        $zone = $this->zoneRepository
            ->findByCity($cityId);

        if (!$zone)
            throw new ZoneException("Raio de chamamento não encontrada");

        return $zone;
    }

    /**
     * Uma viagem agendada direcionada a motoristas (favoriteDrivers) só chama
     * esses motoristas próximo ao horário marcado — não passa pelo matching
     * de motoristas próximos (callDriversClose()), que normalmente garante
     * que só motoristas aptos ao tripType recebem a viagem. Por isso, aqui na
     * criação é preciso validar manualmente que cada motorista informado está
     * vinculado (via categoria/userType) ao tripType da viagem.
     *
     * @param array $driverIds
     * @param int $tripTypeId
     * @throws DriverTripTypeException
     */
    private function validateFavoriteDriversTripType(array $driverIds, int $tripTypeId)
    {
        $ineligibleDrivers = $this->driverRepository
            ->findIneligibleForTripType($driverIds, $tripTypeId);

        if ($ineligibleDrivers->isEmpty())
            return;

        $names = $ineligibleDrivers->pluck('name')->implode(', ');
        $tripTypeName = TripType::query()->find($tripTypeId)->type ?? 'selecionado';

        throw new DriverTripTypeException(
            $ineligibleDrivers->count() > 1
                ? "Os motoristas {$names} não atendem o tipo de viagem \"{$tripTypeName}\". Ajuste a categoria deles ou escolha outros motoristas."
                : "O motorista {$names} não atende o tipo de viagem \"{$tripTypeName}\". Ajuste a categoria dele ou escolha outro motorista."
        );
    }

    private function tripWayPoints(Trip &$trip, array $tripWayPoints)
    {
        $trip
            ->tripWayPoints()
            ->saveMany(array_map(function ($tripWayPoint) use ($trip) {
                $tripWayPoint = new TripWayPoint($tripWayPoint);
                $tripWayPoint
                    ->setAttribute(
                        'tripReference',
                        $trip
                            ->getAttribute('tripReference')
                    );

                return $tripWayPoint;
            }, $tripWayPoints));
    }

    private function createDeliveryInfo(Trip $trip, $deliveryInfoRequest): void
    {
        $deliveryInfo = new DeliveryInfo($deliveryInfoRequest);
        $deliveryInfo->tripReference = $trip->tripReference;

        $trip->deliveryInfo()
            ->save($deliveryInfo);
    }

    private function createTripItems(Trip $trip, $tripItemsRequest)
    {
        $trip
            ->tripItems()
            ->saveMany(array_map(function ($tripItem) use ($trip) {
                $tripItem = new TripItem($tripItem);
                $tripItem
                    ->setAttribute(
                        'tripReference',
                        $trip
                            ->getAttribute('tripReference')
                    );

                return $tripItem;
            }, $tripItemsRequest));
    }

    private function callDriversClose(Trip $trip, int $centralId)
    {
        /** @var Central $central */
        $central = $this->centralRepository
            ->find($centralId);

        $drivers = $this->driversCloseTheTripRepository
            ->findDriversClose($trip->tripReference, $central);

        return $drivers->map(function ($driver) use ($centralId) {
            $driverCalled = $this->driverCalledRepository
                ->create([
                    'driverId' => $driver->idDriver,
                    'tripReference' => $driver->tripReference,
                    'proximity' => $driver->proximity,
                    'destinationProximity' => $driver->destinationProximity,
                    'status' => DriverCalledConst::CALLING,
                ]);

            app(TripDriverNotificationWpp::class)->handle($driver->idDriver, $centralId);
            return $driverCalled;
        });
    }

    private function sendToRealtime(Trip $trip)
    {
        $tripRealtime = new RealtimeTrip;
        $tripRealtime->mount((object) $trip->toArray());

        return $this->tripRealtimeService->create($tripRealtime);
    }

    private function log($data, $user_id, $tripReference)
    {
        try {
            return $this->logRepository
                ->insert(
                    $data,
                    "VIAGEM INSERIDA PELA CENTRAL",
                    $user_id,
                    $tripReference
                );
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
        }
    }

    private function createResponseQuestion(array $questions, $tripReference)
    {
        foreach ($questions as $question) {
            $centralTripInfoResponse = new CentralTripInfoResponse();
            $centralTripInfoResponse->centralTripInfoQuestionId = $question['questionId'];
            $centralTripInfoResponse->tripReference = $tripReference;
            $centralTripInfoResponse->response = $question['response'];
            $centralTripInfoResponse->save();
        }
    }
    // Essa funcao serve para criar as taxas na centralapi
    private function createTripTaxes(int $idTrip, int $cityId, int $tripTypeId, array $taxesPaidByCustomerIds = [], ?array $remainingTaxIds = null)
    {
        if ($remainingTaxIds === null) {
            $taxDao = new TaxRepository();
            //Pegarei aqui as taxas cadastradas naquela cidade que estão ativas
            $taxesRemaining = $taxDao->findActivesByCityAndTripType($cityId, $tripTypeId, $taxesPaidByCustomerIds ? ['driver'] : ['driver', 'customer']);
            $remainingTaxIds = array_column($taxesRemaining->all(), 'id');
        }

        $taxIds = array_merge($taxesPaidByCustomerIds, $remainingTaxIds);

        if (!$taxIds) {
            return false;
        }

        $tripTaxes = array_map(function (int $idTax) use ($idTrip) {
            return [
                'tripId' => $idTrip,
                'taxId' => $idTax
            ];
        }, $taxIds);

        $tripTaxRepository = new TripTaxRepository();
        // Caso queira enviar as 2 taxas, dar um foreach em tripTaxes, hoje o fluxo so envia uma, mas é completamente possivel entrar em uma
        return $tripTaxRepository->saveTripTax($tripTaxes[0]);
    }

    /**
     * Resolve (ou cria) o centralCustomer da viagem. Exposto para o fluxo de
     * criação em lote resolver o cliente uma única vez e reaproveitar o id
     * em todas as viagens do lote, evitando duplicar o cadastro do cliente.
     *
     * @param array $tripCustomer
     * @param int $centralId
     * @return \App\Models\Central\CentralCustomer
     */
    public function resolveCustomer($tripCustomer, $centralId)
    {
        return $this->findOrCreateCustomer($tripCustomer, $centralId);
    }

    /**
     * Resolve uma única vez os dados que são idênticos entre todas as viagens
     * de um lote (mesma origem/destino/cidade/tipo de viagem) — cidade,
     * origin/destination, comissões, zona e taxas ativas — para reaproveitar
     * em newTrip($request, $user, $cache, $sharedContext) em vez de repetir
     * as mesmas consultas/inserts uma vez por viagem do lote.
     *
     * Editar uma viagem específica do lote depois faz uma origin/destination
     * nova (ver UpdateScheduledTripService::updateOne()), então compartilhar
     * aqui na criação é seguro — não afeta as demais viagens do lote.
     *
     * @param array $request
     * @return array
     * @throws DriverCommissionException
     * @throws ZoneException
     */
    public function resolveSharedBatchContext(array $request): array
    {
        /** @var City $city */
        $city = $this->cityRepository
            ->findByCoordinate($request['origin']['latitude'], $request['origin']['longitude']);

        $taxesPaidByCustomerIds = $request['taxes'] ?? [];
        $taxDao = new TaxRepository();
        $taxesRemaining = $taxDao->findActivesByCityAndTripType($city->id, $request['tripTypeId'], $taxesPaidByCustomerIds ? ['driver'] : ['driver', 'customer']);

        return [
            'city' => $city,
            'origin' => $this->originRepository->create($request['origin']),
            'destination' => $this->destinationRepository->create($request['destination']),
            'driverCommission' => $this->findDriverCommission($city->id, $request['tripTypeId']),
            'partnerCommission' => $this->findPartnerCommission($city->id, $request['tripTypeId']),
            'zone' => $this->findZone($city->id),
            'remainingTaxIds' => array_column($taxesRemaining->all(), 'id'),
        ];
    }

    private function scheduleTrip(string $tripReference, string $schedule, ?string $scheduleUTC = null): void
    {
        $this->tripScheduledRepository->create([
            'tripReference' => $tripReference,
            'schedule' => $schedule ? Carbon::parse($schedule)->toDateTimeString() : null,
            'scheduleUTC' => $scheduleUTC ? Carbon::parse($scheduleUTC)->toDateTimeString() : null,
        ]);
    }
}
