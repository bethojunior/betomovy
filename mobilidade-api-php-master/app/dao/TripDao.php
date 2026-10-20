<?php

namespace app\dao;

use app\constant\EstablishmentBalanceConst;
use app\constant\TripCancellationCustomerFeeConst;
use app\constant\TripPaymentFormConst;
use app\dtos\TripCallPushDTO;
use app\exceptions\PriceException;
use app\services\CityConfigService;
use app\services\DriverCalledService;
use app\services\DriverCommissionService;
use app\services\TripRouteTracingService;
use app\services\TripService;
use app\utils\BaseDao;
use app\utils\ChannelAbstract;
use app\utils\Connection;
use app\utils\RedisUtil;
use app\model\City;
use app\model\CityConfig;
use app\model\Config;
use app\model\Customer;
use app\model\Destination;
use app\model\Driver;
use app\model\Establishment;
use Exception;
use app\model\LevelAccess;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Origin;
use app\model\Station;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripPaymentForm;
use app\model\TripScheduled;
use app\model\User;
use DateTime;
use stdClass;

use function Aws\boolean_value;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 17:27
 */
class TripDao extends BaseDao
{
    /**
     * @var \app\model\Trip $trip
     */
    private $trip;
    private $queryTrip;
    private $driverCalledService;
    private $cityConfigService;
    private $tripWayPointDao;
    private $driverCommissionService;
    private $rewardTripDao;
    private $rewardCampaignTripDao;
    private $tripRouteTracingService;
    private $TRIP_FLOW_WPP = 'whatsapp';

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->driverCalledService = new DriverCalledService();
        $this->cityConfigService = new CityConfigService();
        $this->tripWayPointDao = new TripWayPointDao();
        $this->driverCommissionService = new DriverCommissionService();
        $this->rewardTripDao = new RewardTripDao();
        $this->rewardCampaignTripDao = new RewardCampaignTripDao();
        $this->tripRouteTracingService = new TripRouteTracingService();
        parent::__construct(null, $sql);
    }

    /**
     * @param $data
     * @return array|mixed
     * @throws Exception
     */
    public function new($data)
    {
        try {
            $this->beginTransaction();

            // 1. Resolve or Create Customer (Support Central, Customer App and Establishment)
            $customer = null;
            $custData = $data->customer ?? ($data->tripCustomer ?? ($data->centralCustomer ?? null));

            if (!empty($data->customerId)) {
                try {
                    $customer = (new CustomerDao())->find($data->customerId);
                } catch (\Throwable $t) {}
            }

            if (!$customer && $custData) {
                if (is_array($custData)) {
                    $custData = (object)$custData;
                }
                if (!empty($custData->id)) {
                    try {
                        $customer = (new CustomerDao())->find($custData->id);
                    } catch (\Throwable $t) {}
                }
                if (!$customer && !empty($custData->userId)) {
                    try {
                        $customer = (new CustomerDao())->findByUser($custData->userId);
                    } catch (\Throwable $t) {}
                }
                if (!$customer && (!empty($custData->name) || !empty($custData->phone))) {
                    try {
                        $customer = (new CustomerDao())->create($custData);
                    } catch (\Throwable $t) {}
                }
            }

            if (!$customer && !empty($data->userId)) {
                try {
                    $customer = (new CustomerDao())->findByUser($data->userId);
                } catch (\Throwable $t) {}
            }

            if ($customer && method_exists($customer, 'getIdCustomer')) {
                $data->customerId = $customer->getIdCustomer();
            }

            // Central customer handling if centralId is present
            if (!empty($data->centralId) && $custData) {
                try {
                    $cCustData = is_array($custData) ? (object)$custData : $custData;
                    if (!empty($cCustData->name) || !empty($cCustData->phone)) {
                        $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                        $stmtCheck = $pdo->prepare("SELECT id FROM centralCustomer WHERE (phone = :phone OR name = :name) AND centralId = :centralId LIMIT 1");
                        $stmtCheck->execute([
                            ':phone' => $cCustData->phone ?? '',
                            ':name' => $cCustData->name ?? '',
                            ':centralId' => $data->centralId
                        ]);
                        $cId = $stmtCheck->fetchColumn();
                        if (!$cId) {
                            $stmtIns = $pdo->prepare("INSERT INTO centralCustomer (name, phone, centralId, userId, created_at, updated_at) VALUES (:name, :phone, :centralId, :userId, NOW(), NOW())");
                            $stmtIns->execute([
                                ':name' => $cCustData->name ?? '',
                                ':phone' => $cCustData->phone ?? '',
                                ':centralId' => $data->centralId,
                                ':userId' => $data->userId ?? null
                            ]);
                            $cId = $pdo->lastInsertId();
                        }
                        if ($cId) {
                            $data->centralCustomerId = (int)$cId;
                        }
                    }
                } catch (\Throwable $t) {}
            }

            // 2. Resolve Origin & Destination
            if (isset($data->origin) && is_object($data->origin) && empty($data->originId)) {
                try {
                    $origin = (new OriginDao())->create($data->origin);
                    if ($origin && method_exists($origin, 'getIdOrigin')) {
                        $data->originId = $origin->getIdOrigin();
                        if (empty($data->cityId) && method_exists($origin, 'getCityId')) {
                            $data->cityId = $origin->getCityId();
                        }
                    }
                } catch (\Throwable $t) {}
            }

            if (isset($data->destination) && is_object($data->destination) && empty($data->destinationId)) {
                try {
                    $dest = (new DestinationDao())->create($data->destination);
                    if ($dest && method_exists($dest, 'getIdDestination')) {
                        $data->destinationId = $dest->getIdDestination();
                    }
                } catch (\Throwable $t) {}
            }

            // 3. Resolve City
            if (empty($data->cityId)) {
                if (isset($data->origin->latitude, $data->origin->longitude)) {
                    try {
                        $city = (new \app\services\CityService())->findCityByCoordinate($data->origin->latitude, $data->origin->longitude);
                        if ($city && !empty($city->id)) {
                            $data->cityId = $city->id;
                        }
                    } catch (\Throwable $t) {}
                }
                if (empty($data->cityId) && !empty($_SERVER['HTTP_CITYID'])) {
                    $data->cityId = (int)$_SERVER['HTTP_CITYID'];
                }
            }

            // 4. Resolve Trip Call Type
            if (empty($data->tripCallTypeId)) {
                if (!empty($data->centralId)) {
                    $data->tripCallTypeId = 4; // CENTRAL
                } else {
                    $data->tripCallTypeId = 1; // NORMAL
                }
            }

            // 5. Driver Commission
            if (empty($data->driverCommissionId) && !empty($data->cityId) && !empty($data->tripTypeId)) {
                try {
                    $originObj = isset($data->origin) && is_object($data->origin) ? $data->origin : null;
                    $data->driverCommissionId = $this->driverCommissionService
                        ->findCommissionId($data->cityId, $data->tripTypeId, $originObj);
                } catch (\Throwable $t) {}
            }

            $data->date = $data->date ?? now();
            $validStatuses = ['searching', 'searching_favorite', 'accepted', 'pre_accepted', 'boarding', 'in_progress', 'finished', 'canceled', 'not_answered', 'back_off', 'payment_refused', 'scheduled', 'stand_by', 'get_bid_by_drivers', 'waiting'];
            if (empty($data->status) || !in_array($data->status, $validStatuses)) {
                $data->status = !empty($data->schedule) ? 'scheduled' : 'searching';
            }
            if (isset($data->favoriteDrivers) && is_array($data->favoriteDrivers)) {
                $data->favoriteDrivers = implode(',', $data->favoriteDrivers);
            }
            if (isset($data->haveReturn)) {
                $data->haveReturn = !empty($data->haveReturn) ? 1 : 0;
            } else {
                $data->haveReturn = 0;
            }
            if (isset($data->isCalling)) {
                $data->isCalling = !empty($data->isCalling) ? 1 : 0;
            }
            if (isset($data->isOffer)) {
                $data->isOffer = !empty($data->isOffer) ? 1 : 0;
            }
            if (isset($data->isOpenPriceTrip)) {
                $data->isOpenPriceTrip = !empty($data->isOpenPriceTrip) ? 1 : 0;
            }

            // 6. Create Trip Record
            $this->trip = $this->createTrip($data);

            // 7. Payment for Establishment only if establishmentId is provided
            $establishment = null;
            if (!empty($data->establishmentId)) {
                try {
                    $this->tripPayment($establishment);
                } catch (\Throwable $t) {}
            }

            // 8. Push to Drivers (Fail-safe)
            $vehicleCategory = null;
            try {
                $vehicleCategory = (new TripTypeDao())->find($this->trip->getTripTypeId())->type ?? null;
                $this->sendPushDriversClose(
                    $this->trip->getTripReference(),
                    $this->trip->getPrice(),
                    $vehicleCategory,
                    $this->trip->getUserId(),
                    $this->trip->getTripCallTypeId()
                );
            } catch (\Throwable $t) {}

            // 9. Waypoints
            if (!empty($data->waypoints) && (is_array($data->waypoints) || is_object($data->waypoints))) {
                try {
                    $wpDao = new TripWayPointDao();
                    $wps = is_array($data->waypoints) ? $data->waypoints : [$data->waypoints];
                    foreach ($wps as $wp) {
                        $wpObj = is_array($wp) ? (object)$wp : $wp;
                        if (is_object($wpObj)) {
                            $wpObj->tripReference = $this->trip->getTripReference();
                            $wpDao->create($wpObj);
                        }
                    }
                } catch (\Throwable $t) {}
            }

            // 10. Commit transaction first so trip is committed in DB
            $this->commit();
            $committed = true;

            // 11. Fetch and return complete trip
            try {
                $trip = $this->find($this->trip->getTripReference());
            } catch (\Throwable $e) {
                $trip = $this->trip;
            }

            return $trip;
        } catch (Exception $e) {
            if (empty($committed)) {
                try {
                    $this->rollback();
                } catch (\Throwable $t) {}
            }
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @param $calculateRoute
     * @return array|mixed
     * @throws Exception
     */
    public function find($tripReference, $calculateRoute = false)
    {
        $tripPaymentFormTable = (new TripPaymentForm())->getTableName();
        $userTable = (new User())->getTableName();
        $tripAuditTable = (new TripAudit())->getTableName();
        $levelAccessTable = (new LevelAccess())->getTableName();
        $driverTable = (new Driver())->getTableName();

        try {
            $trip = $this->sqlRawSelect(
                /** @lang sql */
                "
                SELECT
                t.idTrip,
                t.tripReference,
                t.flow,
                t.aditionalInfo,
                t.status,
                t.establishmentId,
                t.stationId,
                t.driverId,
                t.centralId,
                t.centralCustomerId,
                t.userId,
                u.nickname AS customerName,
                u.quantityTrips,
                u.phone AS customerPhone,
                t.customerId,
                t.tripCustomerId,
                t.price,
                t.oldPrice,
                t.distance,
                t.priceId,
                t.priceRangeId,
                t.date,
                t.endDate,
                t.zoneId,
                t.cityId,
                t.cancellationReasonsId,
                t.canceledBy,
                t.driverNetValue,
                ta.situation,
                t.tripAuditId,
                ta.color AS colorAudit,
                t.destinationId,
                t.originId,
                t.tripTypeId,
                tt.type AS tripType,
                tt.deliveryOption,
                tt.onlyCentral,
                t.tripPaymentFormId,
                tPF.name AS tripPaymentForm,
                tPF.paymentFormTypeId AS tripPaymentFormTypeId,
                t.callingDriver,
                t.driverCommissionId,
                t.partnerCommissionId,
                t.rewardTripId,
                t.tripCallTypeId,
                tct.name AS tripCallType,
                t.estimatedTimeDriverArrival,
                t.estimatedTripTime,
                t.multiplierDynamic,
                t.callAgain,
                t.haveReturn,
                t.oldDestinationId,
                t.centralNeighborhoodId,
                t.isOffer,
                t.favoriteDrivers,
                dc.value AS driverCommissionValue,
                dc.valueType AS driverCommissionType,
                dc.disableOnPromotion,
                {$levelAccessTable}.userTypeId,
                uT.name as userTypeName,
                uT.boardingText,
                uT.acceptedText,
                uT.inProgressText,
                (
                  SELECT GROUP_CONCAT(tCCF_P.feeValue)
                  FROM tripCancellationCustomerFee tCCF_P
                  WHERE tCCF_P.paid_tripReference = t.tripReference
                ) AS cancellationFee_paid,
                (
                  SELECT GROUP_CONCAT(tCCF_P.tripReference)
                  FROM tripCancellationCustomerFee tCCF_P
                  WHERE tCCF_P.paid_tripReference = t.tripReference
                ) AS tripReferenceCancellationFee_generated
              FROM {$this->table} t
              INNER JOIN {$tripPaymentFormTable} tPF ON t.tripPaymentFormId = tPF.idTripPaymentForm
              INNER JOIN {$userTable} u ON t.userId = u.idUser
              LEFT JOIN {$driverTable} d ON t.driverId = d.idDriver
              LEFT JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = d.userId
              INNER JOIN {$tripAuditTable} ta ON ta.id = t.tripAuditId
              INNER JOIN tripType tt ON tt.idTripType = t.tripTypeId
              INNER JOIN tripCallType tct ON tct.id = t.tripCallTypeId
              LEFT JOIN userType uT on {$levelAccessTable}.userTypeId = uT.idUserType
              LEFT JOIN driverCommission dc ON dc.idDriverCommission = t.driverCommissionId
              WHERE t.tripReference = :tripReference
              GROUP BY t.idTrip
              LIMIT 1
            ",
                [':tripReference' => $tripReference]
            )
                ->get(false);

            // adicionei um "LIMIT 1" pq quando o cliente tem mais de uma taxa de cancelamento ele gera mais de uma linha. Refatorar essa query futuramente, creio que possa remover este LEFT JOIN "  LEFT JOIN tripCancellationCustomerFee as tCCF_G".

            if (empty($trip)) {
                throw new Exception("VIAGEM NÃO ENCONTRADA");
            }

            $trip = $this->mountTripObjects($trip, $calculateRoute);

            return $trip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    public function findDriverNetPrice($tripReference)
    {
        $sql = "
            SELECT
                IF(
                    dC.valueType = '$',
                    ROUND(
                        (
                            trip.price -
                            IFNULL(
                                ROUND(bfof.value, 2),
                                ROUND(dC.value, 2)
                            ) - IFNULL(ROUND(bfpf.value, 2), 0)
                            - IFNULL(bfdt.dynamicTaxValue, 0)
                        ),
                        2
                    ),
                    ROUND(
                        (
                            trip.price -
                            IFNULL(
                                ROUND(bfof.value, 2),
                                ROUND(trip.price * (dC.value / 100), 2)
                            ) -
                            IFNULL(
                                ROUND(bfpf.value, 2),
                                0
                            )
                            - IFNULL(bfdt.dynamicTaxValue, 0)
                        ),
                        2
                    )
                ) AS driverValue
            FROM
                trip
            LEFT JOIN
                driverCommission AS dC ON trip.driverCommissionId = dC.idDriverCommission
            LEFT JOIN
                balanceFlow AS bfpf ON bfpf.balanceFlowTypeId = :balanceFlowTypeId1 AND bfpf.tripReference = trip.tripReference
            LEFT JOIN
                balanceFlow AS bfof ON bfof.balanceFlowTypeId = :balanceFlowTypeId2 AND bfof.tripReference = trip.tripReference
            LEFT JOIN
                (
                    SELECT tripTax.tripId, SUM(IF(tax.valueType = '$', tax.value, t2.price * tax.value / 100)) AS dynamicTaxValue
                    FROM tripTax
                    INNER JOIN tax ON tax.id = tripTax.taxId
                    INNER JOIN trip AS t2 ON t2.idTrip = tripTax.tripId
                    GROUP BY tripTax.tripId
                ) AS bfdt ON bfdt.tripId = trip.idTrip
            WHERE
                trip.tripReference = :tripReference
        ";

        return $this->sqlRawSelect($sql, [
            ':balanceFlowTypeId1' => 43,
            ':balanceFlowTypeId2' => 8,
            ':tripReference' => $tripReference,
        ])->first();
    }

    /**
     * @param $tripReference
     * @return \app\model\Trip
     */
    public function findObject($tripReference): Trip
    {
        return new Trip($this->sqlSelect(
            [],
            [['tripReference', '=', ':tripReference']]
        )
            ->bind([':tripReference' => $tripReference])
            ->get(false));
    }

    /**
     * @param $idTrip
     * @return array|mixed
     */
    public function findSimpleById($idTrip)
    {
        return $this->sqlSelect(
            [],
            [['idTrip', '=', ':idTrip']]
        )
            ->bind([':idTrip' => $idTrip])
            ->get(false);
    }

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function findFully($tripReference, $positions = false)
    {
        try {
            $location = new LocationDao();
            $redis = new RedisUtil();

            // $result = $redis->get("trip-{$tripReference}");
            // if ($result)
            //     return $result;

            $this->queryTrip = $this->find($tripReference);

            $this->queryTrip->timeToExpireTrip = $this->driverCalledService
                ->getTimeToExpireTrip($tripReference);

            $cityId = $this->queryTrip->cityId;

            $this->queryTrip->cityConfig = $cityId ?
                $this->cityConfigService
                ->getByCity($cityId)
                ->toStdClass() :
                null;


            if ($this->queryTrip->cityConfig->showNetValueForDriverOnCall == 1) {
                $driverValue = $this->findDriverNetPrice($tripReference)->driverValue ?? null;

                $this->queryTrip->driverValue = $driverValue;
            }

            $this->queryTrip->financialBreakdown = $this->buildFinancialBreakdown($this->queryTrip);

            // Evitar crash no frontend
            $this->queryTrip->ecoInfo = null;

            if ($positions) {
                $routeTracing = $this->tripRouteTracingService->findByTrip((object) ['tripReference' => $tripReference]);
                $this->queryTrip->routeTracing = $routeTracing->tracing ?? null;

                // getByTrip() lê de coleção deprecated; posições reais ficam em getByTripFromNode()
                $this->queryTrip->location = $location->getByTripFromNode($tripReference);
            };

            $redis->set("trip-{$tripReference}", $this->queryTrip);

            return $this->queryTrip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * Monta o breakdown financeiro usando o driverCommissionId gravado na própria viagem.
     *
     * @param stdClass $trip
     * @return array|null
     */
    private function buildFinancialBreakdown($trip)
    {
        if (empty($trip->driverCommissionId)) {
            return null;
        }

        $cancellationFeeValue = $trip->cancellationFee_paid
            ? array_sum(array_map('floatval', explode(',', $trip->cancellationFee_paid)))
            : 0;

        $reward = 0;

        if (!empty($trip->rewardTripId)) {
            $rewardTrip = $this->rewardTripDao->findOne($trip->rewardTripId);
            $reward += $rewardTrip->value ?? 0;
        }

        foreach ($this->rewardCampaignTripDao->findByTrip($trip->tripReference) as $rewardCampaignTrip) {
            $reward += $rewardCampaignTrip->value ?? 0;
        }

        $commission = $this->driverCommissionService->find($trip->driverCommissionId);

        $breakdown = $this->driverCommissionService->buildFinancialBreakdown(
            $commission,
            new Trip($trip),
            $cancellationFeeValue
        );

        $ledgerNetValue = $this->findDriverNetPrice($trip->tripReference)->driverValue ?? null;

        $breakdown['grossPrice'] = $trip->price;
        $breakdown['reward'] = $reward;
        $breakdown['netValue'] = $ledgerNetValue !== null
            ? $ledgerNetValue + $reward
            : $trip->price
                - $breakdown['appFee']
                - $breakdown['anotherFee']
                - $breakdown['paymentFormFee']
                - $breakdown['cancellationFee']
                - $breakdown['dynamicTax']
                + $reward;

        return $breakdown;
    }

    /**
     * @param $idTrip
     * @return array|mixed
     * @throws Exception
     */
    public function findById($idTrip)
    {
        try {
            $tripPaymentFormTable = (new TripPaymentForm())->getTableName();
            $establishmentTable = (new Establishment())->getTableName();
            $cityTable = (new City())->getTableName();
            $stationTable = (new Station())->getTableName();
            $destinationTable = (new Destination())->getTableName();
            $customerTable = (new Customer())->getTableName();
            $originTable = (new Origin())->getTableName();
            $userTable = (new User())->getTableName();

            $this->queryTrip = $this->sqlRawSelect(
                /** @lang sql */
                "
                SELECT
                  t.idTrip,
                  t.tripReference,
                  t.status,
                  t.establishmentId,
                  t.stationId,
                  t.driverId,
                  t.customerId,
                  t.price,
                   t.oldPrice,
                  e.fantasyName,
                  u.deviceToken as userDeviceToken,
                  CASE
                    WHEN t.customerId IS NOT NULL THEN
                      ct.name
                    ELSE
                      u.name
                  END AS customerName,
                  CASE
                    WHEN t.customerId IS NOT NULL THEN
                      ct.phone
                    ELSE
                      u.phone
                  END AS customerPhone,
                  CASE
                  WHEN t.originId IS NOT NULL
                    THEN o.address
                    ELSE
                      CONCAT(
                          e.address,
                          ', ', e.number,
                          ' - ', c.nome
                      )
                  END AS originAddress,
                  CASE
                    WHEN t.stationId IS NOT NULL THEN
                      s.name
                    ELSE
                      d.address
                  END AS destinationAddress,
                  t.date,
                  t.endDate,
                  t.destinationId,
                  t.originId,
                  t.tripPaymentFormId,
                  t.multiplierDynamic,
                  tPF.name AS tripPaymentForm,
                  tPF.paymentFormTypeId AS tripPaymentFormTypeId
                FROM {$this->table} t
                  INNER JOIN {$tripPaymentFormTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
                  INNER JOIN {$userTable} u on t.userId = u.idUser
                  LEFT JOIN {$customerTable} ct ON t.customerId = ct.idCustomer
                  LEFT JOIN {$originTable} o ON t.originId = o.idOrigin
                  LEFT JOIN {$establishmentTable} e on t.establishmentID = e.idEstablishment
                  LEFT JOIN {$cityTable} c ON e.cityId = c.id
                  LEFT JOIN {$stationTable} s ON t.stationId = s.idStation
                  LEFT JOIN {$destinationTable} d on t.destinationId = d.idDestination
                  WHERE idTrip = :idTrip
            ",
                [':idTrip' => $idTrip]
            )
                ->get(false);

            if (empty($this->queryTrip)) {
                throw new Exception("VIAGEM NÃO ENCONTRADA");
            }

            $this->queryTrip->ecoInfo = $this->mountEcoInfo();

            return $this->queryTrip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    public function findForScheduleNotification(string $tripReference): object
    {
        try {
            $tripPaymentFormTable = (new TripPaymentForm())->getTableName();
            $establishmentTable   = (new Establishment())->getTableName();
            $cityTable            = (new City())->getTableName();
            $stationTable         = (new Station())->getTableName();
            $destinationTable     = (new Destination())->getTableName();
            $customerTable        = (new Customer())->getTableName();
            $originTable          = (new Origin())->getTableName();
            $userTable            = (new User())->getTableName();

            $trip = $this->sqlRawSelect(
                /** @lang sql */
                "
                SELECT
                  t.tripReference,
                  t.price,
                  t.date,
                  t.cityId,
                  t.tripTypeId,
                  t.estimatedTripTime,
                  t.estimatedTimeDriverArrival,
                  t.distance,
                  o.neighborhood AS originNeighborhood,
                  d.neighborhood AS destinationNeighborhood,
                  ts.schedule AS scheduleDate,
                  tt.type as tripType,
                  CASE
                    WHEN t.customerId IS NOT NULL THEN ct.name
                    ELSE u.name
                  END AS customerName,
                  CASE
                    WHEN t.customerId IS NOT NULL THEN ct.phone
                    ELSE u.phone
                  END AS customerPhone,
                  CASE
                    WHEN t.originId IS NOT NULL THEN o.address
                    ELSE CONCAT(e.address, ', ', e.number, ' - ', c.nome)
                  END AS originAddress,
                  CASE
                    WHEN t.stationId IS NOT NULL THEN s.name
                    ELSE d.address
                  END AS destinationAddress,
                  tPF.name AS tripPaymentForm
                FROM {$this->table} t
                  LEFT JOIN {$tripPaymentFormTable} tPF ON t.tripPaymentFormId = tPF.idTripPaymentForm
                  LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference
                  LEFT JOIN {$userTable} u ON t.userId = u.idUser
                  LEFT JOIN {$customerTable} ct ON t.customerId = ct.idCustomer
                  LEFT JOIN {$originTable} o ON t.originId = o.idOrigin
                  LEFT JOIN {$establishmentTable} e ON t.establishmentID = e.idEstablishment
                  LEFT JOIN {$cityTable} c ON e.cityId = c.id
                  LEFT JOIN {$stationTable} s ON t.stationId = s.idStation
                  LEFT JOIN {$destinationTable} d ON t.destinationId = d.idDestination
                  INNER JOIN tripType tt ON t.tripTypeId = tt.idTripType
                WHERE t.tripReference = :tripReference
            ",
                [':tripReference' => $tripReference]
            )
                ->get(false);

            if (empty($trip)) {
                throw new Exception("VIAGEM NÃO ENCONTRADA");
            }

            return $trip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * @param $trip
     * @param bool $calculateRoute
     * @return mixed
     * @throws Exception
     */
    private function mountTripObjects($trip, $calculateRoute = true)
    {
        $trip->establishment = !empty($trip->establishmentId) ? (new EstablishmentDao())
            ->find($trip->establishmentId, ['fantasyName AS address', 'latitude', 'longitude', 'commercialPhone', 'balanceId']) :
            null;

        $trip->origin = !empty($trip->originId) ?
            (new OriginDao())->find($trip->originId) :
            $trip->establishment;

        $trip->destination = $this->mountDestination($trip->stationId, $trip->destinationId);

        $trip->tripWayPoints = $this->tripWayPointDao
            ->findByTrip($trip->tripReference);

        $trip->customer = $this->mountCustomer($trip);

        $trip->driver = $this->mountDriver($trip, $calculateRoute);

        $trip->rewardTrip = (new TripService())
            ->mountRewardTrip(new Trip($trip));

        $trip->tripLongDistanceValue = $this->moundTripLongDistanceValue(new Trip($trip));

        $this->mountFreightAttributes($trip);

        $trip->schedule = (new TripScheduledDao())
            ->findByTrip($trip->tripReference);

        $trip->priceRange = $trip->priceRangeId ?
            (new PriceRangeDao())
            ->find($trip->priceRangeId) : null;

        $trip->fare = $trip->priceId ?
            $this->mountPrice($trip->priceId) : null;

        $this->oldPrice = $trip->oldPrice;

        $trip->tripDiscountCoupon = (new TripDiscountCouponDao())
            ->findByTrip($trip->tripReference);

        $trip->recalculatedPrice = $this->mountRecalculated($trip->tripReference);

        $trip->ride = $this->mountRide($trip->tripReference);

        $trip->tolls = $this->mountTolls($trip->idTrip);

        $trip->taxes = $this->mountTaxes($trip->idTrip);

        $trip = $this->mountCustomerCancellationFee($trip);

        if ($trip->status == Trip::GET_BID_BY_DRIVERS) {
            $trip->tripBids = (new TripBidDao())->getBidsByTrip($trip->idTrip);

            $trip->tripBids = array_map(function ($tripBid) {
                $tripBid->driver = (new DriverDao())->find($tripBid->driverId);
                return $tripBid;
            }, $trip->tripBids);
        }

        return $trip;
    }

    private function mountTolls(int $idTrip)
    {
        return (new TollTripDao())->findByTrip($idTrip);
    }

    private function mountTaxes(int $idTrip)
    {
        return (new TripTaxDao())->findByTrip($idTrip);
    }

    private function moundTripLongDistanceValue(Trip $trip)
    {
        if (!$trip->getDriverId()) {
            return null;
        }

        $tripLongDistanceValue =
            (new TripLongDistanceValueDao())
            ->findByDriverAndTrip($trip->getIdTrip(), $trip->getDriverId());

        if (!$tripLongDistanceValue) {
            return null;
        }

        return $tripLongDistanceValue;
    }

    private function mountRide($tripReference)
    {
        $ride = (new RideDao())
            ->findByTrip($tripReference);

        if (!$ride) {
            return null;
        }

        $ride->riders = $this->mountRiders($ride->id);

        $ride->rideItems = (new RideItemsDao())
            ->findByRide($ride->id);

        return $ride;
    }

    public function mountRiders(int $rideId)
    {
        $riders = (new RiderDao())
            ->findByRide($rideId);

        foreach ($riders as $rider) {
            $rider->waypoints = (new RideWayPointDao())
                ->findByRiderTripCustomer($rider->riderTripCustomerId);
        }

        return $riders;
    }

    private function mountRecalculated($tripReference)
    {
        $recalculate = (new RecalculatedTripDao())
            ->findLast($tripReference);

        return empty($recalculate) ? null : $recalculate;
    }

    /**
     * @param $priceId
     * @return stdClass
     */
    private function mountPrice($priceId)
    {
        try {
            $price = (new PriceDao())
                ->findById($priceId);
        } catch (PriceException $e) {
            return null;
        }

        return $price->toStdClass();
    }

    private function mountFreightAttributes(&$trip)
    {
        $trip->deliveryInfo = (new DeliveryInfoDao())
            ->findByTripReference($trip->tripReference);

        $trip->freightInfo = (new FreightInfoDao())
            ->findByTripReference($trip->tripReference);

        $trip->tripItems = (new TripItemDao())
            ->findByTripReference($trip->tripReference);

        $trip->freightItems = (new FreightItemDao())
            ->findByTrip($trip->tripReference);

        $trip->accessibility = [
            'obstacle' => (new AccessibilityObstacleDao())
                ->findByTripReference($trip->tripReference),
            'assistant' => (new AccessibilityAssistantDao())
                ->findByTripReference($trip->tripReference),
        ];

        $freightPictures = (new FreightPictureDao())->findByTrip($trip->tripReference);

        $storage_link = Config::get('link_storage_pictures');
        $tripReference = $trip->tripReference;

        $trip->freightPictures =
            !$freightPictures ?
            null :
            array_map(function ($picture) use ($storage_link, $tripReference) {
                return $storage_link . "freight/{$tripReference}/{$picture}";
            }, json_decode($freightPictures->pictures));
    }

    /**
     * @param $trip
     * @return array|mixed
     * @throws Exception
     */
    private function mountCustomer($trip)
    {
        if (($trip->flow ?? null) === $this->TRIP_FLOW_WPP) {
            return (new CustomerDao())->findByUserForTrip($trip->userId);
        }

        if (isset($trip->tripCustomerId)) {
            return (new TripCustomerDao())
                ->find($trip->tripCustomerId);
        }

        if (isset($trip->customerId)) {
            return (new CustomerDao())
                ->find($trip->customerId);
        }

        if (isset($trip->centralCustomerId)) {
            return (new CentralCustomerDao())
                ->find($trip->centralCustomerId);
        }

        return (new CustomerDao())
            ->findByUserForTrip($trip->userId);
    }

    private function mountCustomerCancellationFee($trip)
    {
        $trip->customerCancellationFee = (new TripCancellationCustomerFeeDao())
            ->findByTrip($trip->tripReference);

        if ($trip->customerCancellationFee) {
            $trip->tripPaymentForm =
                TripCancellationCustomerFeeConst::FRONT_END_MESSAGE_TO_GENERATED_CANCELLATION_FEE;
        }

        return $trip;
    }

    /**
     * @param $trip
     * @param $calculateRoute
     * @return array|mixed|null
     * @throws Exception
     */
    private function mountDriver($trip, $calculateRoute)
    {
        $driver = $this->driverWithEstimative(
            $trip->status,
            $trip->driverId,
            empty($trip->establishment) ? $trip->origin : $trip->establishment,
            $calculateRoute
        );

        if ($driver) {
            $tripPreAccepted = $this->findTripPreAccepted($trip->driverId);
            $driver->tripPreAccepted = empty($tripPreAccepted) ? null : $tripPreAccepted;
        }

        return $driver;
    }

    /**
     * @param $stationId
     * @param $destinationId
     * @return array|mixed
     * @throws Exception
     */
    private function mountDestination($stationId, $destinationId)
    {
        if ($stationId) {
            return (new StationDao())
                ->find($stationId, ['name', 'latitude', 'longitude']);
        }

        return (new DestinationDao())
            ->find($destinationId, ['address AS name', 'latitude', 'longitude', 'neighborhood', 'cityId']);
    }

    /**
     * @param $tripStatus
     * @param $driverId
     * @param $origin
     * @param $calculateRoute
     * @return array|mixed|null
     * @throws Exception
     */
    private function driverWithEstimative($tripStatus, $driverId, $origin, $calculateRoute)
    {
        $driver = null;

        if ($driverId != null) {
            $driver = (new DriverDao())->find($driverId);
            $driver->estimative = (new Driver())->generateNullEstimative();
        }

        return $driver;
    }

    /**
     * Estabelecimento cancelar uma viagem
     * @param $tripReference
     * @param $userId
     * @param $dateEnd
     * @return array|mixed
     * @throws Exception
     */
    public function cancel($tripReference, $dateEnd, $userId)
    {
        try {
            $this->beginTransaction();

            $trip = $this->find($tripReference);

            $this->manageEstablishmentBalanceInCancel($trip);

            $this->cancelByEstablishment($tripReference, $dateEnd);

            $trip = $this->find($tripReference);

            $logData = (object)[
                'tripReference' => $trip->tripReference,
                'userId' => $userId,
                'data' => $trip
            ];

            $this->createLogEstablishment(
                $logData,
                $trip->tripReference,
                $userId,
                "VIAGEM CANCELADA PELO ESTABELECIMENTO",
                LogCriticalType::AVISO
            );

            $this->commit();

            return $trip;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @param $zoneId
     * @return array|mixed
     * @throws Exception
     */
    public function increaseArea($tripReference, $zoneId)
    {
        try {
            $trip = $this->find($tripReference);

            if ($trip->zoneId != $zoneId) {
                $this->sqlUpdate(
                    ['zoneId' => $zoneId],
                    [['tripReference', '=', ':tripReference']],
                    [':tripReference' => $tripReference]
                );
                $trip->zoneId = $zoneId;
            }

            $result = $this->sendPushDriversClose(
                $trip->tripReference,
                isset($trip->price) ? (float)$trip->price : null,
                $trip->tripType ?? null,
                $trip->userId ?? null,
                $trip->tripCallTypeId ?? null
            );

            $logData = (object)[
                'drivers' => $result['resultDrivers'],
                'resultPush' => $result['resultPush'],
                'trip' => $trip
            ];

            $this->createLogEstablishment(
                $logData,
                $trip->tripReference,
                $trip->userId,
                "AREA DE BUSCA PELO MOTORISTA AUMENTADA"
            );

            return ['trip' => $trip];
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @param bool $fullyObject
     * @param bool $isIgnorePreAccepted
     * @return array|mixed
     * @throws Exception
     */
    public function findCurrentByDriver($driverId, $fullyObject = true, $isIgnorePreAccepted = false)
    {
        try {
            $where = array_merge(
                [
                    ['driverId', '=', ':driverId', 'AND'],
                    ['(status', '<>', ':status_canceled', 'AND'],
                    ['status', '<>', ':status_back_off', 'AND'],
                    ['status', '<>', ':status_not_answered', 'AND'],
                    ['status', '<>', ':status_finished', 'AND'],
                ],
                $isIgnorePreAccepted ?
                    [
                        ['status', '<>', ':status_pre_accepted', 'AND'],
                        ['status', '<>', ':status_scheduled)']
                    ] :
                    [
                        ['status', '<>', ':status_scheduled)']
                    ]
            );

            $binds = [
                ':driverId' => $driverId,
                ':status_back_off' => Trip::BACK_OFF,
                ':status_not_answered' => Trip::NOT_ANSWERED,
                ':status_canceled' => Trip::CANCELED,
                ':status_finished' => Trip::FINISHED,
                ':status_scheduled' => Trip::SCHEDULED
            ];

            if ($isIgnorePreAccepted) {
                $binds = array_merge($binds, [':status_pre_accepted' => Trip::PRE_ACCEPTED]);
            }

            $trip = $this->sqlSelect(
                [],
                $where,
                ['idTrip', 'ASC']
            )
                ->bind($binds)
                ->get();

            if (isset($trip[0]) && $fullyObject) {
                /**
                 * customerName é o nome do cliente que pediu a viagem
                 */
                $trip[0]->customerName = (new UserDao())
                    ->find($trip[0]->userId, ['nickname AS customerName'])->customerName;

                $trip[0]->tripPaymentForm = (new TripPaymentFormDao())
                    ->find($trip[0]->tripPaymentFormId)->name;

                $trip[0]->origin = (new OriginDao())->find($trip[0]->originId);

                $trip[0]->destination = $this->findDestination(new Trip($trip[0]));

                $trip[0]->tripWayPoints = $this->tripWayPointDao
                    ->findByTrip($trip[0]->tripReference);

                $trip[0]->customer = $this->mountCustomer($trip[0]);
            }

            return $trip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    public function findTripPreAccepted($driverId)
    {
        return $this->sqlSelect(
            [],
            [
                ['driverId', '=', ':driverId', 'AND'],
                ['status', '=', ':status']
            ]
        )
            ->bind([
                ':driverId' => $driverId,
                ':status' => Trip::PRE_ACCEPTED,
            ])
            ->get(false);
    }

    /**
     * Encontrar a viagem atual de um cliente final
     * pelo userId
     * @param $userId
     * @param bool $fullObject
     * @return array|mixed
     * @throws Exception
     */
    public function findCurrentByUserCustomer($userId, $fullObject = true)
    {
        try {
            $tripPaymentFormTable = (new TripPaymentForm())->getTableName();
            $userTable = (new User())->getTableName();

            $trip = $this->sqlRawSelect(
                /** @lang sql */
                "
                SELECT
                  t.flow,
                  t.idTrip,
                  t.tripReference,
                  t.status,
                  t.establishmentId,
                  t.stationId,
                  t.driverId,
                  t.userId,
                  u.nickname AS customerName,
                  t.customerId,
                  t.price,
                  t.oldPrice,
                  t.date,
                  t.endDate,
                  t.zoneId,
                  t.priceId,
                  t.cancellationReasonsId,
                  t.canceledBy,
                  t.tripAuditId,
                  t.destinationId,
                  t.originId,
                  t.tripTypeId,
                  t.rewardTripId,
                  t.centralId,
                  t.centralCustomerId,
                  t.priceRangeId,
                  t.tripPaymentFormId,
                  tPF.name AS tripPaymentForm,
                  tPF.paymentFormTypeId AS tripPaymentFormTypeId,
                  t.cityId
                FROM {$this->table} t
                  INNER JOIN {$tripPaymentFormTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
                  INNER JOIN {$userTable} u on t.userId = u.idUser
                WHERE
                  t.userId = :userId AND
                  t.status NOT IN
                    (:statusCanceled, :statusFinished, :statusNotAnswered, :statusBackOff, :paymentRefused, :scheduled) AND
                  t.centralId IS NULL
                ORDER BY t.date DESC LIMIT 1
            ",
                [
                    ':userId' => $userId,
                    ':statusCanceled' => Trip::CANCELED,
                    ':statusFinished' => Trip::FINISHED,
                    ':statusNotAnswered' => Trip::NOT_ANSWERED,
                    ':statusBackOff' => Trip::BACK_OFF,
                    ':paymentRefused' => Trip::PAYMENT_REFUSED,
                    ':scheduled' => Trip::SCHEDULED,
                ]
            )
                ->get(false);

            if ($trip && $fullObject) {
                $trip = $this->mountTripObjects($trip);
            }

            return $trip;
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function findWithTimeline($tripReference)
    {
        $trip = $this->find($tripReference);

        $tripLogs = (new TripLogDao())->findLogsWithDriver($tripReference);

        $trip->timelineStatus = (new TripService())->mountTimelineStatus($tripLogs);

        return $trip;
    }

    /**
     * @param $status
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function updateStatus($status, $tripReference)
    {
        return $this->sqlUpdate(
            ['status' => ':status'],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => $status,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param $driverId
     * @param $tripReference
     * @param null $estimatedTimeDriverArrival
     * @param bool $isScheduled
     * @return bool
     * @throws Exception
     */
    public function acceptTrip(
        $driverId,
        $tripReference,
        $estimatedTimeDriverArrival = null,
        $isScheduled = false,
        $driverNetValue = null
    ) {
        $status = empty($this->findCurrentByDriver($driverId, false)) ?
            Trip::ACCEPTED : Trip::PRE_ACCEPTED;

        $set = [
            'status' => ':status',
            'driverId' => ':driverId',
            'driverNetValue' => ':driverNetValue'
        ];

        $bind = [
            ':status' => $status,
            ':driverId' => $driverId,
            ':tripReference' => $tripReference,
            ':driverNetValue' => $driverNetValue
        ];

        if ($estimatedTimeDriverArrival) {
            $set['estimatedTimeDriverArrival'] = ':estimatedTimeDriverArrival';
            $bind[':estimatedTimeDriverArrival'] = $estimatedTimeDriverArrival;
        }

        $where = [
            [
                'tripReference',
                '=',
                ':tripReference'
            ],
        ];

        if (!$isScheduled) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['driverId', 'IS', 'NULL'];
        }

        return $this->sqlUpdate(
            $set,
            $where,
            $bind
        );
    }

    /**
     * @param $tripReference
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    public function informArrival($tripReference, $tripAuditId)
    {
        return $this->sqlUpdate(
            ['status' => ':status', 'tripAuditId' => ':tripAuditId'],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::BOARDING,
                ':tripReference' => $tripReference,
                ':tripAuditId' => $tripAuditId
            ]
        );
    }

    /**
     * @param $tripReference
     * @param $cancellationReasonsId
     * @return bool
     * @throws Exception
     */
    public function cancelByDriver($tripReference, $cancellationReasonsId)
    {
        return $this->sqlUpdate(
            [
                'status' => ':status',
                'endDate' => ':endDate',
                'cancellationReasonsId' => ':cancellationReasonsId',
                'canceledBy' => ':canceledBy'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::CANCELED,
                ':endDate' => now(),
                ':cancellationReasonsId' => $cancellationReasonsId,
                ':canceledBy' => Trip::CANCELED_BY_DRIVER,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param $tripReference
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    public function initTrip($tripReference, $tripAuditId)
    {
        return $this->sqlUpdate(
            ['status' => ':status', 'tripAuditId' => ':tripAuditId'],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::IN_PROGRESS,
                ':tripReference' => $tripReference,
                ':tripAuditId' => $tripAuditId
            ]
        );
    }

    /**
     * @param $tripReference
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    public function waitingTrip($tripReference, $tripAuditId)
    {
        return $this->sqlUpdate(
            ['status' => ':status', 'tripAuditId' => ':tripAuditId'],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::WAITING,
                ':tripReference' => $tripReference,
                ':tripAuditId' => $tripAuditId
            ]
        );
    }

    /**
     * @param $tripReference
     * @param $date
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    public function finishTrip($tripReference, $date, $tripAuditId)
    {
        $isTripStatusChangeAllowed = self::tripHasFinished($tripReference);

        if ($isTripStatusChangeAllowed) {
            throw new Exception("Alterar para o status 'Finalizada' não é permitido para o estado atual da corrida. Evento duplicado");
        }

        return $this->sqlUpdate(
            ['status' => ':status', 'endDate' => ':endDate', 'tripAuditId' => ':tripAuditId'],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::FINISHED,
                ':tripReference' => $tripReference,
                ':endDate' => $date,
                ':tripAuditId' => $tripAuditId
            ]
        );
    }

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function shareInfo($tripReference)
    {
        $this->queryTrip = (new TripSummaryViewDao())
            ->find($tripReference);

        $this->validateShareInfo();

        $this->queryTrip->driver = (new DriverDao())
            ->find($this->queryTrip->driverId, true, false);

        return $this->queryTrip;
    }

    /**
     * @param $tripReference
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    public function updateAudit($tripReference, $tripAuditId)
    {
        return $this->sqlUpdate(
            ['tripAuditId' => $tripAuditId],
            [['tripReference', '=', ':tripReference']],
            [':tripReference' => $tripReference]
        );
    }

    public function updateEstimativeAndPrice(
        string $tripReference,
        float $distance,
        float $estimatedTripTime,
        float $price
    ) {
        return $this->sqlUpdate(
            compact('distance', 'estimatedTripTime', 'price'),
            [['tripReference', '=', ':tripReference']],
            [':tripReference' => $tripReference]
        );
    }

    public function updateEstimativeAndDistance(
        string $tripReference,
        float $distance,
        float $estimatedTripTime,
        float $price
    ) {
        return $this->sqlUpdate(
            compact('distance', 'estimatedTripTime', 'price'),
            [['tripReference', '=', ':tripReference']],
            [':tripReference' => $tripReference]
        );
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function tripFinancialDetail($tripReference)
    {
        return (new TripFinancialDetailDao())
            ->find($tripReference);
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function updateTripToStartCall($tripReference)
    {
        return $this->sqlUpdate(
            ['isCalling' => ':isCalling'],
            [['tripReference', '=', ':tripReference']],
            [':isCalling' => true, ':tripReference' => $tripReference]
        );
    }

    /**
     * @param $userId
     * @param array $fields
     * @return array|mixed
     */
    public function getActiveTripsByUser($userId, $fields = [])
    {
        return $this->sqlSelect(
            $fields,
            [
                ['userId', '=', ':userId', 'AND'],
                ['status', '<>', ':finishedStatus', 'AND'],
                ['status', '<>', ':cancelledStatus', 'AND'],
                ['status', '<>', ':notAnswered', 'AND'],
                ['status', '<>', ':paymentRefused', 'AND'],
                ['status', '<>', ':backOff'],
            ]
        )
            ->bind([
                ':userId' => $userId,
                ':finishedStatus' => Trip::FINISHED,
                ':cancelledStatus' => Trip::CANCELED,
                ':notAnswered' => Trip::NOT_ANSWERED,
                ':paymentRefused' => Trip::PAYMENT_REFUSED,
                ':backOff' => Trip::BACK_OFF,
            ])
            ->get();
    }

    /**
     * @param $establishment
     * @throws Exception
     */
    private function tripPayment(&$establishment)
    {
        $establishment = (new EstablishmentDao())
            ->findWithUser($this->trip->getEstablishmentId(), $this->trip->getUserId());

        if (!$this->trip->getTripPaymentFormId()) {
            throw new Exception("Forma de pagamento não informada");
        }

        if ($this->trip->getTripPaymentFormId() == TripPaymentFormConst::VOUCHER) {
            $this->voucherPayment($establishment);
        }
    }

    /**
     * @param $establishment
     * @throws Exception
     */
    private function voucherPayment(&$establishment)
    {
        if ($establishment->tripBalance < $this->trip->getPrice()) {
            throw new Exception("Você não possui saldo suficiente");
        }

        $establishment->balance = (new BalanceDao())
            ->subBalanceForNewTrip($establishment->balanceId, $this->trip, EstablishmentBalanceConst::TRIP_BALANCE_LOCKOUT);
    }

    /**
     * @param $data
     * @return Trip
     * @throws Exception
     */
    private function createTrip($data): Trip
    {
        if (isset($data->origin) && is_object($data->origin) && empty($data->originId)) {
            try {
                $origin = (new OriginDao())->create($data->origin);
                if ($origin && method_exists($origin, 'getIdOrigin')) {
                    $data->originId = $origin->getIdOrigin();
                    if (empty($data->cityId) && method_exists($origin, 'getCityId')) {
                        $data->cityId = $origin->getCityId();
                    }
                }
            } catch (\Throwable $t) {}
        }

        if (isset($data->destination) && is_object($data->destination) && empty($data->destinationId)) {
            try {
                $destination = (new DestinationDao())->create($data->destination);
                if ($destination && method_exists($destination, 'getIdDestination')) {
                    $data->destinationId = $destination->getIdDestination();
                }
            } catch (\Throwable $t) {}
        }

        if (empty($data->tripReference)) {
            $data->tripReference = \app\utils\UUID::v4();
        }

        /** @var Trip $trip */
        $trip = $this->create($data);

        $tripRef = null;
        try {
            $res = $this->sqlSelect(['tripReference'], [['idTrip', '=', $trip->getIdTrip()]])->get(false);
            if (is_object($res) && !empty($res->tripReference)) {
                $tripRef = $res->tripReference;
            } elseif (is_array($res) && !empty($res[0]->tripReference)) {
                $tripRef = $res[0]->tripReference;
            }
        } catch (\Throwable $t) {}

        if (empty($tripRef)) {
            $tripRef = $data->tripReference;
        }

        $trip->setTripReference($tripRef);

        return $trip;
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLogEstablishment($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::PWA)
            ->setMessage($message);

        return (new LogDao())->insert($log);
    }

    /**
     * @param ChannelAbstract $channelClass
     * @param array $data
     * @param string $eventName
     * @return array|bool
     * @throws Exception
     */
    private function createEventChannel(ChannelAbstract $channelClass, array $data, string $eventName)
    {
        foreach ($data as $key => $value) {
            $channelClass->setData($key, $value);
        }

        return $channelClass->trigger($eventName);
    }

    /**
     * @param string $tripReference
     * @param string $dateEnd
     * @throws Exception
     */
    private function cancelByEstablishment(string $tripReference, string $dateEnd)
    {
        $this->sqlUpdate(
            [
                'status' => ':status',
                'endDate' => ':endDate',
                'canceledBy' => ':canceledBy'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::CANCELED,
                ':endDate' => $dateEnd,
                ':canceledBy' => Trip::CANCELED_BY_ESTABLISHMENT,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param string $tripReference
     * @param string $dateEnd
     * @throws Exception
     */
    public function cancelByCustomerPartner(string $tripReference, string $dateEnd)
    {
        $this->sqlUpdate(
            [
                'status' => ':status',
                'endDate' => ':endDate',
                'canceledBy' => ':canceledBy'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => Trip::CANCELED,
                ':endDate' => $dateEnd,
                ':canceledBy' => Trip::CANCELED_BY_CUSTOMER_PARTNER,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param string $tripReference
     * @param string $dateEnd
     * @param string $status
     * @throws Exception
     */
    public function cancelByCustomer(string $tripReference, string $dateEnd, string $status, int $cancellationReasonsId = null)
    {
        $this->sqlUpdate(
            [
                'status' => ':status',
                'endDate' => ':endDate',
                'canceledBy' => ':canceledBy',
                'cancellationReasonsId' => ':cancellationReasonsId',
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':status' => $status,
                ':endDate' => $dateEnd,
                ':canceledBy' => Trip::CANCELED_BY_CUSTOMER,
                ':tripReference' => $tripReference,
                ':cancellationReasonsId' => $cancellationReasonsId,
            ]
        );
    }

    /**
     * @param string $tripReference
     * @param $newPrice
     * @throws Exception
     */
    public function updatePrice(string $tripReference, $newPrice)
    {
        $this->sqlUpdate(
            ['price' => ':newPrice'],
            [['tripReference', '=', ':tripReference']],
            [
                ':newPrice' => $newPrice,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @return bool
     * @throws Exception
     */
    public function updateDriver($tripReference, $driverId)
    {
        $bind = [':tripReference' => $tripReference];

        if ($driverId) {
            $bind[':driverId'] = $driverId;
        }

        return $this->sqlUpdate(
            ['driverId' => (!$driverId) ? 'NULL' : ':driverId'],
            [['tripReference', '=', ':tripReference']],
            $bind
        );
    }

    /**
     * @param $tripReference
     * @param float|null $price Valor da corrida; se null, a notificação mantém o texto genérico
     * @param string|null $vehicleCategory Nome da categoria do veículo
     * @param mixed $userId Id do cliente dono da trip
     * @param mixed $tripCallTypeId Id do tipo de chamado da trip
     * @return array
     * @throws Exception
     */
    public function sendPushDriversClose($tripReference, ?float $price = null, ?string $vehicleCategory = null, $userId = null, $tripCallTypeId = null)
    {
        $drivers = (new TripDriversDao())
            ->getDriversClose($tripReference);

        $driverModel = new Driver();
        $resultPush = [];

        foreach ($drivers as $driver) {
            if (empty($driver->deviceToken)) continue;

            $proximityKm = isset($driver->proximity) ? (float)$driver->proximity : null;

            $resultPush[] = $driverModel->sendTripNotifications(
                [$driver->deviceToken],
                new TripCallPushDTO($price, $vehicleCategory, $proximityKm, $tripReference, $userId, $tripCallTypeId)
            );
        }

        return ['resultPush' => $resultPush, 'resultDrivers' => $drivers];
    }

    /**
     * @param $tripReference
     * @param $driversId
     * @return bool
     * @throws Exception
     */
    public function updateCallingDriver($tripReference, $driversId)
    {
        return $this->sqlUpdate(
            ['callingDriver' => ':driverId'],
            [['tripReference', '=', ':tripReference']],
            [':driverId' => $driversId, ':tripReference' => $tripReference]
        );
    }

    /**
     * @param $tripReference
     * @param $rewardTripId
     * @return bool
     * @throws Exception
     */
    public function setRewardTrip($tripReference, $rewardTripId)
    {
        return $this->sqlUpdate(
            ['rewardTripId' => ':rewardTripId'],
            [['tripReference', '=', ':tripReference']],
            [':rewardTripId' => $rewardTripId, ':tripReference' => $tripReference]
        );
    }

    public function updateDestination($destinationId, $oldDestinationId, $tripReference)
    {
        return $this->sqlUpdate(
            [
                'destinationId' => ':destinationId',
                'oldDestinationId' => ':oldDestinationId'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':destinationId' => $destinationId,
                ':oldDestinationId' => $oldDestinationId,
                ':tripReference' => $tripReference
            ]
        );
    }

    /**
     * @param Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function findDestination(Trip $trip)
    {
        if (!empty($trip->getStationId())) {
            return (new StationDao())
                ->find($trip->getStationId(), ['name', 'latitude', 'longitude']);
        }

        return (new DestinationDao())
            ->find($trip->getDestinationId(), ['address AS name', 'latitude', 'longitude']);
    }

    /**
     * @param stdClass $trip
     * @return array|mixed
     * @throws Exception
     */
    private function manageEstablishmentBalanceInCancel(stdClass $trip)
    {
        $cancelFee = false;

        if ($trip->driverId != null) {
            $cancelFee = true;
            if ($trip->driver->status == Driver::IN_TRIP) {
                (new DriverDao())->putAvailable($trip->driverId);
            }
        }

        $establishment = (new EstablishmentDao())->find($trip->establishmentId, ['balanceId']);

        if ($trip->tripPaymentFormId == TripPaymentFormConst::VOUCHER) {
            return (new BalanceDao())->returnWithheldBalanceByEstablishmentCancel(
                $establishment->balanceId,
                new Trip($trip),
                $cancelFee
            );
        }

        if ($cancelFee) {
            return (new BalanceDao())
                ->establishmentCancellationFee($establishment->balanceId, $trip->tripReference);
        }
    }

    /**
     * @return array|null
     * @throws Exception
     */
    private function mountEcoInfo()
    {
        return (new TripEcoDao())
            ->find($this->queryTrip->tripReference);
    }

    /**
     * @throws Exception
     */
    private function validateShareInfo()
    {
        if (!$this->queryTrip) {
            throw new Exception("Viagem não encontrada");
        }

        if ($this->queryTrip->status == Trip::FINISHED || $this->queryTrip->status == Trip::CANCELED) {
            throw new Exception("Corrida indisponível para visualização");
        }
    }

    public function findNetPrice($tripReference)
    {
        $sql =
            /** @lang sql */
            "select trip.price,
                   if((dC.valueType = '$'), round(dC.value, 2),
                      round((trip.price * (dC.value / 100)), 2))                        as appValue,
                   round(bfpf.value, 2)                                                 as paymentFormFee,
                   round(bfof.value, 2) - if((dC.valueType = '$'), round(dC.value, 2),
                                             round((trip.price * (dC.value / 100)), 2)) as otherFee,
                   if((dC.valueType = '$'),
                      round((trip.price - ifnull(round(bfof.value, 2), round(dC.value, 2)) - ifnull(round(bfpf.value, 2), 0)), 2),
                      round((trip.price - ifnull(round(bfof.value, 2), round(trip.price * (dC.value / 100), 2)) -
                             ifnull(round(bfpf.value, 2), 0)),
                            2))                                                         as driverValue
            from trip
                     left join driverCommission as dC on trip.driverCommissionId = dC.idDriverCommission
                     left join balanceFlow as bfpf
                               on bfpf.balanceFlowTypeId = 43 and bfpf.tripReference = trip.tripReference
                     left join balanceFlow as bfof
                               on bfof.balanceFlowTypeId = 8 and bfof.tripReference = trip.tripReference
            where trip.tripReference = :tripReference
            group by trip.tripReference";

        return $this->sqlRawSelect(
            $sql,
            [':tripReference' => $tripReference]
        )
            ->get(false);
    }

    /**
     * @param $tripReference
     * @return mixed
     */
    public function findCustomerIdentifiers($tripReference)
    {
        $sql =
            /** @lang sql */
            "select trip.tripCustomerId, trip.customerId, trip.centralCustomerId
             from trip
             where trip.tripReference = :tripReference";

        return $this->sqlRawSelect(
            $sql,
            [':tripReference' => $tripReference]
        )
            ->get(false);
    }

    public function acceptTripBid($tripReference, $driverId, $price, $status)
    {
        return $this->sqlUpdate(
            [
                'driverId' => ':driverId',
                'price' => ':price',
                'status' => ':status'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':driverId' => $driverId,
                ':price' => $price,
                ':status' => $status,
                ':tripReference' => $tripReference
            ]
        );
    }

    public function acceptTripBidByDriver($tripReference, $driverId, $status)
    {
        return $this->sqlUpdate(
            [
                'driverId' => ':driverId',
                'status' => ':status'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':driverId' => $driverId,
                ':status' => $status,
                ':tripReference' => $tripReference
            ]
        );
    }


    public function changePriceTrip($tripReference, $price, $oldPrice = null)
    {
        return $this->sqlUpdate(
            [
                'price' => ':price',
                'oldPrice' => ':oldPrice'
            ],
            [['tripReference', '=', ':tripReference']],
            [
                ':price' => $price,
                ':tripReference' => $tripReference,
                ':oldPrice' => $oldPrice
            ]
        );
    }


    public function findLastTripByUser($userId)
    {
        return $this->sqlRawSelect(
            /** @lang sql */
            "
                SELECT
                t.idTrip,
                t.tripReference,
                t.status,
                t.date
              FROM {$this->table} t
                WHERE
                    t.userId = :userId
                ORDER BY t.date
                DESC LIMIT 1
            ",
            [':userId' => $userId]
        )
            ->get(false);
    }


    public function findTripsSearchingTooLong(int $minutes = 10)
    {
        $dateLimit = (new DateTime())->modify("-{$minutes} minutes")->format('Y-m-d H:i:s');

        $loopingTrips = $this->sqlRawSelect(
            "SELECT t.tripReference, t.status, t.date, t.centralId
                FROM {$this->table} t
                WHERE t.status IN ('searching_favorite','searching')
                AND t.date <= '{$dateLimit}'
                AND t.centralId IS NULL
            ",
        )->get();

        return $loopingTrips;
    }

    public function isTripStatusChangeAllowed($tripReference, $nextStep)
    {
        $trip = $this->sqlRawSelect(
            "SELECT t.status
                FROM {$this->table} t
                WHERE t.tripReference = :tripReference
            ",
            [':tripReference' => $tripReference]
        )->get(false);

        if ($trip->status == $nextStep) {
            return false;
        }

        return true;
    }

    public function tripHasFinished($tripReference)
    {
        $trip = $this->sqlRawSelect(
            "SELECT t.status
            FROM {$this->table} t
            WHERE t.tripReference = :tripReference
        ",
            [':tripReference' => $tripReference]
        )->first();

        return $trip && $trip->status == Trip::FINISHED;
    }

    public function getActivesByActor(string $field, int $id)
    {
        if (!in_array($field, ['userId', 'driverId'])) {
            throw new Exception('Campo inválido');
        }

        $sql = "SELECT t.tripReference, t.status
            FROM {$this->table} t
            WHERE t.{$field} = :id
            AND t.status IN ('in_progress', 'accepted', 'boarding', 'pre_accepted', 'get_bid_by_drivers')
            ORDER BY t.date DESC";

        $trips = $this->sqlRawSelect($sql, [':id' => $id])->get();
        return $trips;
    }

    public function findStatus(string $tripReference)
    {
        return $this->sqlRawSelect(
            "SELECT tripReference, status
             FROM {$this->table}
             WHERE tripReference = :tripReference
             LIMIT 1",
            [':tripReference' => $tripReference]
        )->get(false);
    }
}
