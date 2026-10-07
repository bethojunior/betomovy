<?php

namespace app\services;

use app\constant\DriverConst;
use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\dao\BalanceDao;
use app\dao\BlockReasonsDao;
use app\dao\CarDao;
use app\dao\CityConfigDao;
use app\dao\ConfigDriverLocationDao;
use app\dao\CooperativeDao;
use app\dao\CreditPrepaidPurchaseDao;
use app\dao\DeliveryManStatisticsDao;
use app\dao\DocUserDao;
use app\dao\DriverDao;
use app\dao\DriverStatisticsDao;
use app\dao\LogDao;
use app\dao\PendencyReasonsDao;
use app\dao\PushConfigDao;
use app\dao\RewardCampaignTripDao;
use app\dao\UserDao;
use app\exceptions\DriverException;
use app\exceptions\PriceException;
use app\exceptions\RequestValidatorException;
use app\model\Car;
use app\model\City;
use app\model\Config;
use app\model\ConfigType;
use app\model\Customer;
use app\model\Destination;
use app\model\Driver;
use app\model\DriverRegisterStatus;
use app\model\Establishment;
use app\model\Estate;
use app\model\Origin;
use app\model\RewardTrip;
use app\model\Station;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripLongDistanceValue;
use app\model\TripPaymentForm;
use app\model\TripType;
use app\model\TripWayPoint;
use app\model\User;
use app\utils\Headers;
use app\utils\Logger;
use app\utils\Pagination;
use app\utils\PhoneMessage;
use app\utils\Photo;
use app\utils\Push;
use app\utils\MapUtils;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 10:19
 */
class DriverService
{
    /**
     * Folga (em segundos) além de time_in_seconds_to_call_driver antes do searchTrip
     * considerar a viagem expirada. Cobre a latência real entre o UPDATE de status
     * CALLING e o app efetivamente receber o push/realtime e chamar searchTrip.
     */
    const SEARCH_TRIP_ACCEPT_GRACE_SECONDS = 0;

    private $longDistanceRewardService;
    private $rewardCampaignTripDao;
    private $cooperativeDao;
    private $configLocationDao;
    private $creditPrepaidPurchaseDao;

    public function __construct()
    {
        $this->longDistanceRewardService = new LongDistanceRewardService;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
        $this->cooperativeDao = new CooperativeDao;
        $this->configLocationDao = new ConfigDriverLocationDao;
        $this->creditPrepaidPurchaseDao = new CreditPrepaidPurchaseDao;
    }

    /**
     * @param $request
     * @return array
     */
    public function getWhereForGetTrips($request)
    {
        $where = [['driverId', '=', ':driverId']];
        $bind = [':driverId' => $request->driverId];

        if (isset($request->status)) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['status', '=', ':status'];
            $bind[':status'] = $request->status;
        }

        if (isset($request->date)) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['DATE_FORMAT(date, \'%Y-%m-%d\')', '<=', ':start_day', 'AND'];
            $where[] = ['DATE_FORMAT(date, \'%Y-%m-%d\')', '>=', ':end_day'];
            $bind[':start_day'] = today();
            $bind[':end_day'] = subDays(today(), $request->date);
        }

        return ['where' => $where, 'bind' => $bind];
    }

    public function getSqlForGetTrips($totalRows, $where, $page)
    {
        $tripTable = (new Trip)->getTableName();
        $establishmentTable = (new Establishment)->getTableName();
        $stationTable = (new Station)->getTableName();
        $originTable = (new Origin)->getTableName();
        $destinationTable = (new Destination)->getTableName();
        $estateTable = (new Estate)->getTableName();
        $cityTable = (new City)->getTableName();
        $tripAuditTable = (new TripAudit)->getTableName();
        $tripPaymentFormTable = (new TripPaymentForm)->getTableName();

        $pagination = new Pagination($totalRows, $page);

        $whereString = $this->getWhereLikeString($where);

        $sql = "
            SELECT
                t.idTrip,
                t.tripReference,
                t.status,
                t.stationId,
                t.originId,
                t.establishmentId,
                ta.situation,
                tPF.name AS paymentForm,
                ta.color AS colorAudit,
                CASE
                  WHEN t.originId IS NOT NULL
                    THEN
                      o.address
                    ELSE
                      {$establishmentTable}.fantasyName
                END AS address,
                CASE
                  WHEN t.originId IS NOT NULL
                    THEN o.address
                    ELSE
                      CONCAT(
                        {$establishmentTable}.address,
                        ', ', {$establishmentTable}.number,
                        ' - ', {$cityTable}.nome ,' / ', {$estateTable}.sigla
                      )
                END AS originAddress,
                CASE
                  WHEN t.stationId IS NOT NULL THEN
                    {$stationTable}.name
                  ELSE
                    {$destinationTable}.address
                END AS destiny,
                t.tripAuditId,
                t.driverId,
                t.price,
                t.oldPrice,
                t.date,
                t.distance,
                t.estimatedTripTime,
                tt.type AS tripType
            FROM {$tripTable} t
                INNER JOIN {$tripAuditTable} ta on ta.id = t.tripAuditId
                INNER JOIN {$tripPaymentFormTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
                INNER JOIN tripType tt ON tt.idTripType = t.tripTypeId
                LEFT JOIN {$establishmentTable} ON t.establishmentId = {$establishmentTable}.idEstablishment
                LEFT JOIN {$originTable} o ON t.originId = o.idOrigin
                LEFT JOIN {$stationTable} ON t.stationId = {$stationTable}.idStation
                LEFT JOIN {$destinationTable} ON t.destinationId = {$destinationTable}.idDestination
                LEFT JOIN {$cityTable} ON {$establishmentTable}.cityId = {$cityTable}.id
                LEFT JOIN {$estateTable} ON {$establishmentTable}.estateId = {$estateTable}.id
            WHERE {$whereString} ORDER BY date DESC LIMIT {$pagination->getLimit()}
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    public function getSqlForGetTripsActives($driverId)
    {
        $tripTable = (new Trip)->getTableName();

        $sql = "
            SELECT
                t.tripReference,
                t.status
            FROM {$tripTable} t
            WHERE driverId = {$driverId}
            AND (
                t.status = 'in_progress' OR
                t.status = 'accepted' OR
                t.status = 'boarding' OR
                t.status = 'pre_accepted'
            )
        ";

        return ['sql' => $sql];
    }

    public function mountEditDriver($data)
    {
        $set = [];
        $bind = [];

        if (isset($data->password))
            $data->password = (new User($data))->getPassword();

        foreach ($data as $key => $value) {
            if ($value) {
                if ($key != 'driverId' && $key != 'idUser')
                    $set[$key] = ":$key";
                if ($key != 'driverId')
                    $bind[":$key"] = $value;
            }
            if ($key == 'isValidDocument' || $key == 'zafiraValidated') {
                $set[$key] = ":$key";
                $bind[":$key"] = $value;
            }
        }

        return ['set' => $set, 'bind' => $bind, 'where' => ['idUser', '=', ':idUser']];
    }

    /**
     * Returns the new photo's name
     * @param $newPhoto
     * @param null $oldPhoto
     * @param bool $isTemp
     * @return string
     * @throws Exception
     */
    public function updateProfileImage($newPhoto, $oldPhoto = null, $isTemp = true)
    {
        $photo = new Photo;


        if ($oldPhoto)
            $photo
                ->remove($oldPhoto, $isTemp ? Driver::PROFILE_DIR_TEMP : Driver::PROFILE_DIR);

        return $photo->save($newPhoto, $isTemp ? Driver::PROFILE_DIR_TEMP : Driver::PROFILE_DIR);
    }

    /**
     * @param Driver $driver
     * @param $photos
     * @return Driver
     * @throws Exception
     */
    public function updateDocsImages(Driver $driver, $photos): Driver
    {
        $this->removeOldPicturesOnUpdateDocs($driver, $photos);

        if (isset($photos['CNH']) && !empty($photos['CNH']))
            $driver->setCnhPicture($photos['CNH']);

        if (isset($photos['CRLV']) && !empty($photos['CRLV']))
            $driver->setCrlvPicture($photos['CRLV']);

        if (isset($photos['ALVARA']) && !empty($photos['ALVARA']))
            $driver->setAlvaraPicture($photos['ALVARA']);

        return $driver;
    }

    public function calculateTripDistance(array $trips, $driverId)
    {
        $mapUtils = new MapUtils();

        return array_filter(array_map(function ($trip) use ($driverId, $mapUtils) {
            $trip->timeLimitToAccept = (int)Config::get(
                'time_in_seconds_to_call_driver',
                ConfigType::TRIP
            );

            $trip->estimative = $mapUtils->buildEstimative($trip->proximity ?? null);

            $rewardTrip = $this->mountRewardTrip(
                $trip->estimative->distance->value,
                $driverId,
                new Trip($trip)
            );

            $trip->rewardTrip =
                $rewardTrip->value ? ['value' => $rewardTrip->value] : null;
            $trip->tripLongDistance =
                $rewardTrip->tripLongDistanceValue ? ['value' => $rewardTrip->tripLongDistanceValue] : null;

            return $trip;
        }, $trips));
    }


    /**
     * @param \app\model\Trip $trip
     * @return null|RewardTrip
     * @throws Exception
     */
    public function rewardDriverLongDistance(Trip $trip)
    {
        return $this->longDistanceRewardService
            ->findAndUpdateRewardTrip($trip);
    }

    /**
     * @param $distance
     * @param $driverId
     * @param \app\model\Trip $trip
     * @return null|object|stdClass
     * @throws PriceException
     */
    private function mountRewardTrip($distance, $driverId, Trip $trip)
    {
        $rewardTripLongDistance = $this->longDistanceRewardService
            ->insert($distance, $driverId, $trip);

        $sumReward = $this->getCampaignRewardsValue($trip->getTripReference());

        if ($rewardTripLongDistance && !$rewardTripLongDistance instanceof TripLongDistanceValue)
            $sumReward += $rewardTripLongDistance->getValue();

        $objectReward = new stdClass();
        $objectReward->value = $sumReward > 0 ? $sumReward : null;

        $objectReward->tripLongDistanceValue =
            $rewardTripLongDistance instanceof TripLongDistanceValue ? $rewardTripLongDistance->getValue() : null;

        return $objectReward;
    }

    /**
     * @param $tripReference
     * @return float
     */
    private function getCampaignRewardsValue($tripReference): float
    {
        $rewards = $this->rewardCampaignTripDao
            ->findByTrip($tripReference);

        $sum = 0;

        foreach ($rewards as $reward) {
            $sum += $reward->value;
        }

        return (float)$sum;
    }

    /**
     * @param $driver
     * @return mixed
     * @throws Exception
     */
    public function getReasons($driver)
    {
        switch ($driver->driverRegisterStatusId) {
            case DriverRegisterStatus::BLOQUEADO:
                $driver->reasons = (new BlockReasonsDao)->getByDriver($driver->idDriver);
                return $driver;
            case DriverRegisterStatus::PENDENTE:
                $driver->reasons = (new PendencyReasonsDao)->getByDriver($driver->idDriver);
                return $driver;
            default:
                return $driver;
        }
    }

    /**
     * @param \app\model\Customer $customer
     * @return mixed
     * @throws Exception
     */
    public function sendSmsToCustomerAfterTrip(Customer $customer)
    {
        /**
         * Essa config possui um atributo chamado {name} onde deve ser substituído
         * pelo nome do cliente
         */
        $message = Config::get('sms_after_finish_trip_to_customer', ConfigType::TRIP);
        $customerName = explode(' ', $customer->getName());

        $message = str_replace('{name}', $customerName[0], $message);

        $phoneMessage = new PhoneMessage($customer->getPhone(), $message);

        return $phoneMessage->send();
    }

    /**
     * @param $deviceToken
     * @param $driverPicture
     * @param $driverName
     * @return Push
     */
    public function mountDriverArrivalPush($deviceToken, $driverPicture, $driverName, $driverType = 'MOTORISTA'): Push
    {
        $pushConfig = (new PushConfigDao())->find('driver_arrival');

        $pushConfig->setTitle(str_replace('{driverType}', $driverType, $pushConfig->getTitle()));
        $pushConfig->setMessage(str_replace('{driverName}', $driverName, $pushConfig->getMessage()));

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setAction(PushActionConst::OPEN_APP_ON_DRIVER_ARRIVAL)
            ->setTitle($pushConfig->getTitle())
            ->setBody($pushConfig->getMessage())
            ->setImage(DriverConst::driverPictureProfileDir() . $driverPicture)
            ->setImageType(PushConst::IMAGE_TYPE_CIRCULAR)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setForceStart(PushConst::FORCE_START);

        return $push;
    }

    public function mountCar($data, $driverId): Car
    {
        $car = new Car;
        $car
            ->setPlate($data->licensePlate)
            ->setRenavam($data->renavam)
            ->setBrand($data->markCar)
            ->setModel($data->modelCar)
            ->setColor($data->colorCar)
            ->setSeatsNumber($data->numberSeatingCar)
            ->setYear($data->year)
            ->setDriverId($driverId)
            ->setRentalCar($data->rentalCar ?? null)
            ->setRentalCompanyDocument($data->rentalCompanyDocument ?? null)
            ->setIdCar(
                (new CarDao)
                    ->sqlInsert($car)
            );

        return $car;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function updateAppVersion($request)
    {
        $dao = new DriverDao;
        $dao
            ->updateDriverAppVersion($request->driverId, $request->driverAppVersion);

        if (isset($request->deviceToken)) (new UserDao)
            ->updateDeviceToken(Headers::getUserId(), $request->deviceToken);

        return true;
    }

    /**
     * @param $appIsOpen
     * @return bool
     * @throws Exception
     */
    public function updateStatusApp($appIsOpen)
    {
        $dao = new DriverDao;

        $driver = $dao
            ->findByUserId(Headers::getUserId(), false);

        if (!$driver)
            throw new DriverException(502);

        $dao
            ->updateAppIsOpen($appIsOpen, $driver->idDriver);

        return true;
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findFully($driverId, bool $showStatistics = true)
    {
        try {

            $dao = new DriverDao;
            $driver = $dao->findWithTrip($driverId);
            $cityConfig = (new CityConfigDao)->getByCity($driver->cityId);
            $timezone = $cityConfig->timezone ?? Config::get('application_timezone');

            $driver->prepaidData = $this->creditPrepaidPurchaseDao->findByUser($driver->userId);

            $typeDriver = (new DriverDao)->checkIsDeliveryMan($driverId);

            $statisticsDao = !$typeDriver->isDeliveryMan ? new DriverStatisticsDao : new DeliveryManStatisticsDao;

            $driver->statistics = $showStatistics ? $statisticsDao->find($driverId, $timezone) : null;
            $driver->balance = (new BalanceDao)->find($driver->balanceId);

            $cooperative = $this->cooperativeDao
                ->find($driver->cooperativeId);
            $driver->cooperative = empty($cooperative) ? null : $cooperative;

            $driver->config = $this->configLocationDao
                ->find();

            $driver->docsUser = (new DocUserDao)->findByUser($driver->userId);

            $driver->config->status_realtime_database =
                (bool)Config::get('cloud_firestore');

            return $driver;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    private function getPushMessageOnDriverArrival($driverName)
    {
        return str_replace('{driverName}', $driverName, DriverConst::PUSH_MESSAGE_ON_DRIVER_ARRIVAL);
    }

    private function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    /**
     * @param \app\model\Driver $driver
     * @param $photos
     */
    private function removeOldPicturesOnUpdateDocs(Driver $driver, $photos): void
    {
        $photoService = new Photo();

        if (isset($photos['CNH']) && !empty($photos['CNH']))
            $photoService->remove($driver->getCnhPicture(), Driver::DOC_DIR);

        if (isset($photos['CRLV']) && !empty($photos['CRLV']))
            $photoService->remove($driver->getCrlvPicture(), Driver::DOC_DIR);

        if (isset($photos['ALVARA']) && !empty($photos['ALVARA']))
            $photoService->remove($driver->getAlvaraPicture(), Driver::DOC_DIR);
    }

    /**
     * @param $password
     * @return bool
     * @throws DriverException
     * @throws RequestValidatorException
     */
    public function checkPassword($password)
    {
        if (!$password)
            throw new RequestValidatorException(1100);

        $userid = Headers::getUserId();

        $user = new User;
        $user
            ->setIdUser($userid)
            ->setPassword($password);

        $driver = (new DriverDao)
            ->checkPassword($user);

        if (!$driver)
            throw new DriverException(506);

        return true;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function weeklyEarnings($request)
    {
        if (!isset($request->driverId))
            throw new Exception("driverId não enviado");

        $cityId = (new DriverDao)->findSimple($request->driverId, ['cityId'])->cityId;
        $cityConfig = (new CityConfigDao)->getByCity($cityId);

        $typeDriver = (new DriverDao)->checkIsDeliveryMan($request->driverId);

        $statisticsDao = !$typeDriver->isDeliveryMan ? new DriverStatisticsDao : new DeliveryManStatisticsDao;

        $earnings = $statisticsDao
            ->weeklyEarnings($request->driverId, $cityConfig->timezone ?? Config::get('application_timezone'));

        $earningsTotal = 0;

        foreach ($earnings as $earning) {
            $earningsTotal += $earning->total_day;
        }

        return compact('earnings', 'earningsTotal');
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function findPosition($request)
    {
        $dao = new DriverDao;

        if (!isset($request->driverId))
            throw new Exception("ID do motorista não enviado");

        $position = $dao->findPosition($request->driverId);

        return $position;
    }

    public function requestUpdateDriverLocation($request)
    {
        $driver = (new DriverDao)->find($request->driverId);

        $push = new Push;
        $push
            ->setTitle("Atualizando localização")
            ->setBody("Viagem em andamento")
            ->setTag(PushTagConst::REQUEST_UPDATE_DRIVER_LOCATION)
            ->setAction(PushActionConst::OPEN_APP)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->notificationAllWithData([$driver->deviceToken]);
    }

    /**
     * Prefixa colunas ambíguas no array de where com o alias da tabela principal.
     *
     * @param array $where Array de condições [['coluna', 'operador', 'valor', 'AND/OR'], ...]
     * @param string $tableAlias Alias da tabela principal (default 't')
     * @return array Array de where com colunas prefixadas quando necessário
     */
    private function prefixAmbiguousColumns(array $where, string $tableAlias = 't'): array
    {
        // Mapa de colunas que podem gerar ambiguidade
        $ambiguousColumns = [
            'cityId',
            'driverId',
            'tripReference',
            'tripTypeId'
        ];

        foreach ($where as &$condition) {
            if (in_array($condition[0], $ambiguousColumns, true)) {
                $condition[0] = "{$tableAlias}.{$condition[0]}";
            }
        }
        unset($condition);

        return $where;
    }

    public function getWhereForDriverTrips($request)
    {
        $request->driverId ??= null;
        $tripWithoutRefusal = $request->tripWithoutRefusal ??= null;
        $available = $request->available ??= null;

        $where = [];
        $bind = [];

        if ($available === true) {
            $where[] = ['driverId', 'IS', 'NULL'];
        }

        if ($available === false && isset($request->driverId)) {
            $where[] = ['driverId', '=', ':driverId'];
            $bind[':driverId'] = $request->driverId;
        }

        if ($tripWithoutRefusal === true && isset($request->driverId)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $where[] = ['NOT EXISTS (SELECT 1 FROM tripRefused tr WHERE tr.tripId = idTrip AND tr.driverId = :driverId)'];
            $bind[':driverId'] = $request->driverId;
        }

        if (isset($request->cityId)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $where[] = ['cityId', '=', ':cityId'];
            $bind[':cityId'] = $request->cityId;
        }

        if (!empty($request->tripTypeIds) && is_array($request->tripTypeIds)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $placeholders = [];
            foreach ($request->tripTypeIds as $index => $tripTypeId) {
                $placeholder = ":tripTypeId{$index}";
                $placeholders[] = $placeholder;
                $bind[$placeholder] = $tripTypeId;
            }

            $where[] = ['tripTypeId', 'IN', '(' . implode(',', $placeholders) . ')'];
        }

        if (isset($request->status)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $where[] = ['status', '=', ':status'];
            $bind[':status'] = $request->status;
        }

        if (isset($request->dateStart) && isset($request->dateEnd)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $where[] = ['EXISTS (SELECT 1 FROM tripScheduled tsFilter WHERE tsFilter.tripReference = t.tripReference AND DATE(tsFilter.schedule) BETWEEN :dateStart AND :dateEnd)'];
            $bind[':dateStart'] = $request->dateStart;
            $bind[':dateEnd'] = $request->dateEnd;
        }

        if ($available === true && isset($request->driverId)) {
            if (!empty($where)) $where[count($where) - 1][] = 'AND';

            $where[] = ["(t.favoriteDrivers IS NULL OR t.favoriteDrivers = '' OR FIND_IN_SET(:favoriteDriverId, t.favoriteDrivers) > 0)"];
            $bind[':favoriteDriverId'] = $request->driverId;
        }

        $whereString = $this->getWhereLikeString($where);

        return ['where' => $where, 'bind' => $bind, 'where_string' => $whereString];
    }

    public function getWhereForTripsSummary($request)
    {
        $base = $this->getWhereForDriverTrips($request);

        $bind = $base['bind'];

        if (isset($request->driverId)) {
            $bind[':driverId'] = $request->driverId;
        }

        $where = array_filter(
            $base['where'],
            fn($condition) => !(is_array($condition) && $condition[0] === 'driverId')
        );

        $whereString = $this->getWhereLikeString($where);

        return ['where' => $where, 'bind' => $bind, 'where_string' => $whereString];
    }

    public function getSqlForTrips($totalRows, $where, $page, $orderBy = 'date DESC')
    {
        $tripTable = (new Trip)->getTableName();
        $originTable = (new Origin)->getTableName();
        $destinationTable = (new Destination)->getTableName();
        $tripAuditTable = (new TripAudit)->getTableName();
        $tripPaymentFormTable = (new TripPaymentForm)->getTableName();
        $tripTypeTable = (new TripType())->getTableName();

        $pagination = new Pagination($totalRows, $page);

        $where = $this->prefixAmbiguousColumns($where, 't');

        $whereString = $this->getWhereLikeString($where);

        $sql = "
            SELECT
                t.idTrip,
                t.tripReference,
                t.status,
                t.stationId,
                t.originId,
                t.establishmentId,
                ta.situation,
                tPF.name AS tripPaymentForm,
                tPF.paymentFormTypeId,
                ta.color AS colorAudit,
                t.tripAuditId,
                t.driverId,
                t.price,
                t.oldPrice,
                t.date,
                t.cityId,
                t.estimatedTripTime,
                t.distance,
                t.isOffer,
                tt.type AS tripType,
                dc.value AS driverCommissionValue,
                dc.valueType AS driverCommissionType,
                dc.disableOnPromotion,
                IF(o.idOrigin IS NULL, NULL,
                    JSON_OBJECT(
                        'address', o.address,
                        'latitude', o.latitude,
                        'longitude', o.longitude
                    )
                ) AS origin,
                IF(d.idDestination IS NULL, NULL,
                    JSON_OBJECT(
                        'name', d.address,
                        'latitude', d.latitude,
                        'longitude', d.longitude
                    )
                ) AS destination,
                IF(ts.id IS NULL, NULL,
                    JSON_OBJECT(
                        'schedule', ts.schedule,
                        'scheduleUTC', ts.scheduleUTC,
                        'tripReference', ts.tripReference
                    )
                ) AS schedule,
                IF(u.idUser IS NULL, NULL,
                    JSON_OBJECT(
                        'name', COALESCE(cc.name, u.name),
                        'nickname', COALESCE(cc.name, u.nickname),
                        'email', u.email,
                        'profileImage', COALESCE(ccCustomer.profileImage, c.profileImage),
                        'rating', COALESCE(ccUser.rating, u.rating),
                        'quantityTrips', COALESCE(ccUser.quantityTrips, u.quantityTrips),
                        'idUser', u.idUser,
                        'idCustomer', c.idCustomer
                    )
                ) AS customer
            FROM {$tripTable} t
                INNER JOIN {$tripAuditTable} ta on ta.id = t.tripAuditId
                INNER JOIN {$tripPaymentFormTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
                INNER JOIN {$tripTypeTable} tt ON t.tripTypeId = tt.idTripType
                INNER JOIN user u ON t.userId = u.idUser
                INNER JOIN customer c ON u.idUser = c.userId
                LEFT JOIN centralCustomer cc ON t.centralCustomerId = cc.id
                LEFT JOIN user ccUser ON ccUser.idUser = cc.userId
                LEFT JOIN customer ccCustomer ON ccCustomer.userId = ccUser.idUser
                LEFT JOIN {$originTable} o ON t.originId = o.idOrigin
                LEFT JOIN {$destinationTable} d ON t.destinationId = d.idDestination
                LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference
                LEFT JOIN driverCommission dc ON dc.idDriverCommission = t.driverCommissionId
            WHERE {$whereString} ORDER BY {$orderBy} LIMIT {$pagination->getLimit()}
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }
}
