<?php

namespace app\dao;

use app\constant\AdminNotificationTypeConst;
use app\constant\AppConst;
use app\constant\DocUserConst;
use app\constant\DriverCalledConst;
use app\constant\PushActionConst;
use app\constant\PushTagConst;
use app\constant\RecalculatedTripTypeConst;
use app\constant\TripPaymentFormConst;
use app\constant\UserGroupConst;
use app\exceptions\DriverException;
use app\exceptions\PushException;
use app\exceptions\TransactionException;
use app\exceptions\TripException;
use app\exceptions\TripPaymentException;
use app\model\AdminNotification;
use app\model\Balance;
use app\model\Bank;
use app\model\BankAccount;
use app\model\Car;
use app\model\CentralDriver;
use app\model\Config;
use app\model\ConfigType;
use app\model\Customer;
use app\model\DocUser;
use app\model\Driver;
use app\model\DriverAddress;
use app\model\DriverRegisterStatus;
use app\model\DriverStation;
use app\model\Establishment;
use app\model\LevelAccess;
use app\model\Location;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\MilitaryUser;
use app\model\Station;
use app\model\Status;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripCancellationCustomerFee;
use app\model\TripCustomer;
use app\model\TripWayPoint;
use app\model\User;
use app\model\UserIndication;
use app\model\UserType;
use app\realtime\MessagesChatTripRealtime;
use app\realtime\TripRealtime;
use app\realtime\TripRouteRealtime;
use app\services\CheckDocumentService;
use app\services\CustomerCardService;
use app\services\CustomerSplitTripPaymentService;
use app\services\CustomerTripPaymentService;
use app\services\DriverBonusRatingService;
use app\services\DriverCalledService;
use app\services\DriverOnlineTimeService;
use app\services\DriverPenaltyService;
use app\services\DriverReferralMonetizationService;
use app\services\DriverRewardTripService;
use app\services\DriverService;
use app\services\DriverTripScheduled;
use app\services\PartnerSplitTripPaymentService;
use app\services\RecalculatedPriceService;
use app\services\TripCancellationCustomerFeeService;
use app\services\TripCashbackService;
use app\services\TripCustomerService;
use app\services\TripDriversService;
use app\services\TripReceiptService;
use app\services\TripService;
use app\services\TripWayPointService;
use app\services\UserDuplicateCheckService;
use app\services\UserService;
use app\utils\FormatValue;
use app\utils\BaseDao;
use app\utils\ChannelAbstract;
use app\utils\ConfianceValidationPersonalDocument;
use app\utils\Connection;
use app\utils\DirectionService;
use app\utils\Email;
use app\utils\Headers;
use app\utils\Push;
use app\utils\RedisUtil;
use app\utils\TokenApi;
use app\queue\Jobs\DriverRegisterPostCommitJob;
use app\queue\Queue;
use Exception;
use stdClass;
use app\dao\IntegrationPartnersDao;
use app\utils\WhatsApp\WhatsAppService;

class DriverDaoV2 extends BaseDao
{
    protected $service;
    private $tokenApi;
    private $penaltyService;
    private $bonusRatingService;
    private $driverCalledService;
    private $tripDriversService;
    private $driverOnlineTimeService;
    private $driverRewardTripService;
    private $tripWayPointService;
    private $tripCancellationCustomerFeeService;
    private $customerTripPaymentService;
    private $tripCardPaymentDao;
    private $customerCardService;
    private $tripRealtime;
    private $userTypeDao;
    private $tripReceiptService;
    private $resourceDao;
    private $whatsappService;
    protected $table = 'driver';

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->conn = Connection::open();
        $this->service = new DriverService;
        $this->penaltyService = new DriverPenaltyService;
        $this->bonusRatingService = new DriverBonusRatingService;
        $this->driverCalledService = new DriverCalledService;
        $this->driverOnlineTimeService = new DriverOnlineTimeService;
        $this->tripDriversService = new TripDriversService;
        $this->driverRewardTripService = new DriverRewardTripService;
        $this->tripWayPointService = new TripWayPointService;
        $this->tripCancellationCustomerFeeService = new TripCancellationCustomerFeeService;
        $this->customerTripPaymentService = new CustomerTripPaymentService;
        $this->tripCardPaymentDao = new TripCardPaymentDao;
        $this->customerCardService = new CustomerCardService;
        $this->tokenApi = new TokenApi;
        $this->tripRealtime = new TripRealtime;
        $this->userTypeDao = new UserTypeDao;
        $this->tripReceiptService = new TripReceiptService;
        $this->resourceDao = new ResourceDao;
        $this->whatsappService = new WhatsAppService();
        parent::__construct($conn, $sql);
    }

    /**
     * @param $data
     * @param $photos
     * @return stdClass
     * @throws Exception
     */
    public function register($data, $photos, $registerByManager = false, $userLoggedManagerId = null)
    {
        try {
            $this->beginTransaction();

            $user = $this->createUser($data->driver, $photos, $data->appPartner);

            if (isset($data->driver->militaryUser)) {
                $militaryUser =
                    new MilitaryUser($data->driver->militaryUser);

                $militaryUser
                    ->setUserId($user->getIdUser());

                (new MilitaryUserDao)->sqlInsert($militaryUser);
            }

            $driver = $this->createDriver($data->driver, $user->getIdUser(), $photos, $data->appPartner);

            $pendingDocMoves = $this->saveDocs($data->driver, $user, $photos);

            if (isset($data->station))
                $station = $this->attachStation($data->station, $driver->getIdDriver());

            $car = new Car;
            if (isset($data->car))
                $car = (new DriverService)
                    ->mountCar($data->car, $driver->getIdDriver());

            $this->createSpecialties($data, $user->getIdUser(), $driver->getIdDriver());

            if ($registerByManager) {
                $this->createIndication($userLoggedManagerId, $user->getIdUser(), $data->driver->cityId ?? null);
            }

            $adminNotificationType =
                (new AdminNotificationTypeDao)->find(AdminNotificationTypeConst::NEW_DRIVER_REGISTERED);

            $city = (new CityDao)->find($data->driver->cityId);

            $message = str_replace('{userName}', $user->getName(), $adminNotificationType->defaultMessage);
            $message = str_replace('{cityName}', $city->nome, $message);

            $adminNotification = new AdminNotification;
            $adminNotification
                ->setUserId($user->getIdUser())
                ->setIp($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'])
                ->setAdminNotificationTypeId(AdminNotificationTypeConst::NEW_DRIVER_REGISTERED)
                ->setUserGroupId(UserGroupConst::DRIVER)
                ->setMessage($message)
                ->setTitle($adminNotificationType->name)
                ->setCityId($data->driver->cityId)
                ->setId(
                    (new AdminNotificationDao)
                        ->sqlInsert($adminNotification)
                );

            $logData = (object)[
                'driver' => array_merge($driver->toArray(), $user->toArray()),
                'welcome_email_sent' => null,
                'station' => isset($station) ? $station->toStdClass() : null,
                'car' => $car->toStdClass()
            ];

            $this->createLogDriver(
                $logData,
                $driver->getIdDriver(),
                $driver->getUserId(),
                "Novo Motorista Registrado"
            );

            $this->commit();

            Queue::dispatch(DriverRegisterPostCommitJob::class, [
                'userId' => $user->getIdUser(),
                'email' => $user->getEmail(),
                'phone' => $data->driver->phone ?? null,
                'whatsappMessage' => 'Você foi cadastrado como motorista. Seja Bem vindo',
                'files' => $pendingDocMoves,
            ]);

            return $driver->toStdClass();
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }


    /**
     * @param $data
     * @param User $user
     * @param array $photos
     * @return array
     * @throws Exception
     */
    private function saveDocs($data, User $user, $photos = []): array
    {
        if (!isset($data->docs))
            return [];

        $pendingMoves = [];

        foreach ($data->docs as $doc) {
            $docUser = new DocUser;
            $docUser
                ->setUserId($user->getIdUser())
                ->setDocId($doc->docId)
                ->setDocStatusId(DocUserConst::IN_ANALYSIS)
                ->setText($doc->text ?? null);

            $dir = "user/{$user->getIdUser()}/docs/";

            if (isset($photos["DOC_{$doc->docId}"])) {
                $resource = $this->resourceDao->findOrFail($photos["DOC_{$doc->docId}"], ['path']);
                $docUser->setImagePath($resource->path);

                $pendingMoves[] = [
                    'fileName' => $resource->path,
                    'fromDir' => 'uploads/',
                    'toDir' => $dir,
                ];
            }

            if (isset($photos["PDF_{$doc->docId}"])) {
                $resource = $this->resourceDao->findOrFail($photos["PDF_{$doc->docId}"], ['path']);
                $docUser->setPdfPath($resource->path);

                $pendingMoves[] = [
                    'fileName' => $resource->path,
                    'fromDir' => 'uploads/',
                    'toDir' => $dir,
                ];
            }

            $docUser
                ->setId((new DocUserDao)->sqlInsert($docUser));
        }

        return $pendingMoves;
    }

    private function createSpecialties($data, $userIdGenerated, $driverId)
    {
        if (isset($data->whoIndicatedId) && $data->whoIndicatedId) {
            if (preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $data->whoIndicatedId)) {
                $data->whoIndicatedId = base64_decode($data->whoIndicatedId);
            }
            $this->createIndication(
                $data->whoIndicatedId,
                $userIdGenerated,
                $data->driver->cityId ?? null
            );
        }

        if (isset($data->centralId))
            $this->createCentralDriver($data->centralId, $driverId);
    }

    private function createCentralDriver($centralId, $driverId)
    {
        $centralDriver = new CentralDriver;
        $centralDriver
            ->setCentralId($centralId)
            ->setDriverId($driverId)
            ->setId(
                (new CentralDriverDao)
                    ->sqlInsert($centralDriver)
            );

        return $centralDriver;
    }

    /**
     * @param $data
     * @param array $images
     * @return User
     * @throws DriverException
     * @throws Exception
     */
    private function createUser($data, $images = [], $keyAppPartner = null)
    {
        $requiredFilds = (bool)Config::get('requirement_filds_on_register');

        if (!isset($data->document) && !$requiredFilds)
            throw new DriverException(507);

        if (!$requiredFilds) {
            $this->documentIsValid($data->document);
        };

        if (!isset($data->email))
            throw new DriverException(508);

        $this->emailIsValid($data->email);

        if (isset($data->phone) && strlen($data->phone) >= 5) {
            $this->phoneIsValid($data->phone);
        }

        /** @var \app\model\User $user */
        $user = new User($data);
        $user
            ->setCreatedAt(now())
            ->setApiToken($this->tokenApi
                ->generate());

        if (isset($images['RG_FRONT'])) {
            $resource = $this->resourceDao->findOrFail($images['RG_FRONT'], ['path']);
            $user->setRgFrontPicturePath($resource->path);
        }

        if (isset($images['RG_BACK'])) {
            $resource = $this->resourceDao->findOrFail($images['RG_BACK'], ['path']);
            $user->setRgBackPicturePath($resource->path);
        }

        $user->setRegisteredIn('mobilidade');

        if(isset($keyAppPartner)) {
            $user->setAppPartnerKey($keyAppPartner);
        }

        $user
            ->setIdUser(
                (new UserDao)
                    ->sqlInsert($user)
            );

        return $user;
    }

    /**
     * @param $document
     * @throws DriverException
     */
    private function documentIsValid($document)
    {
        $checkDocumentService = new CheckDocumentService;

        $resultSql = $checkDocumentService->sqlCheckDocument(
            $document,
            implode(',', UserType::DRIVERS_TYPE)
        );

        $driver = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if ($driver)
            throw new DriverException(510);
    }

    /**
     * @param $email
     * @throws DriverException
     */
    private function emailIsValid($email)
    {
        $sql = "
            SELECT
                u.email
            FROM {$this->table} d
              INNER JOIN user u ON d.userId = u.idUser
            WHERE u.email = :email AND u.statusId = :statusId
        ";

        $user = $this->sqlRawSelect($sql, [
            ':email' => $email,
            ':statusId' => User::STATUS_ATIVO
        ])
            ->get(false);

        if ($user)
            throw new DriverException(509);
    }

    /**
     * @param $phone
     * @param null|string $ignore
     * @throws DriverException
     */
    private function phoneIsValid($phone, ?string $ignore = null)
    {
        $duplicateCheck = new UserDuplicateCheckService;

        if ($duplicateCheck->phoneExistsForUserTypes($phone, UserType::DRIVERS_TYPE, $ignore)) {
            throw new DriverException(514);
        }
    }

    /**
     * @param $phone
     * @return array
     * @throws DriverException
     */
    public function checkPhoneAvailableForRegister($phone)
    {
        if (empty($phone) || strlen((string) $phone) < 5) {
            throw new Exception('Telefone não enviado');
        }

        $this->phoneIsValid($phone);

        return ['phone' => FormatValue::formatPhoneClear((string) $phone)];
    }

    /**
     * @param User $user
     * @return array|mixed
     * @throws Exception
     */
    public function authenticate(User $user)
    {
        try {
            if (!$user->getDeviceToken())
                throw new Exception("Device token não informado");

            $userTable = (new User)->getTableName();
            $levelAccessTable = (new LevelAccess)->getTableName();

            $authenticate = $this->sqlRawSelect("
                SELECT
                    {$userTable}.idUser,
                    {$userTable}.name AS nameUser,
                    {$userTable}.name,
                    {$userTable}.nickname,
                    {$userTable}.document,
                    {$userTable}.phone,
                    {$userTable}.email,
                    ut.isDeliveryMan,
                    {$this->table}.profileImage,
                    {$this->table}.idDriver,
                    {$this->table}.status,
                    {$this->table}.driverRegisterStatusId,
                    {$this->table}.cityId,
                    {$this->table}.stationId,
                    {$levelAccessTable}.userTypeId,
                    {$userTable}.deviceToken,
                    {$userTable}.api_token
                FROM {$this->table}
                INNER JOIN {$userTable} ON {$userTable}.idUser = {$this->table}.userId
                INNER JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = {$userTable}.idUser
                INNER JOIN userType ut ON levelAccess.userTypeId = ut.idUserType
                WHERE {$userTable}.email = :email
                  AND {$userTable}.password = :password
                  AND {$userTable}.statusId = :statusId
                LIMIT 1
            ", [
                ":email" => $user->getEmail(),
                ":password" => $user->getPassword(),
                ":statusId" => User::STATUS_ATIVO,
            ])->get(false);

            if (empty($authenticate))
                throw new Exception("Usuário ou senha inválida");

            $tokens =
                (new UserDao)->updateTokens($authenticate->idUser, $user->getDeviceToken());

            $authenticate->deviceToken = $tokens['deviceToken'];
            $authenticate->api_token = $this->encryptApiToken($tokens['api_token']);

            $authenticate = $this->service->getReasons($authenticate);
            $appVersion = $this->getDriverAppVersion();
            $authenticate->appVersion = $appVersion->version;
            $authenticate->versionIsCritical = (bool)$appVersion->isCritical;

            $log = new Log(LogType::PROCESS);
            $log->setData($authenticate)
                ->setIdReference($authenticate->idDriver)
                ->setUserId($authenticate->idUser)
                ->setApp(LogApp::DRIVER)
                ->setMessage("Login Efetuado");

            (new LogDao)->insert($log);

            return $authenticate;
        } catch (Exception $e) {
            $message = $e->getMessage();

            if (!empty($authenticate))
                $message .= " |Email: " . $authenticate->email;

            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function autoLogin($request)
    {
        try {
            if (!isset($request->deviceToken))
                throw new Exception("Device token não informado");

            $authenticate = $this->sqlRawSelect("
                SELECT
                    user.idUser,
                    user.name AS nameUser,
                    user.name,
                    user.nickname,
                    user.document,
                    user.phone,
                    user.email,
                    {$this->table}.profileImage,
                    {$this->table}.idDriver,
                    {$this->table}.status,
                    {$this->table}.driverRegisterStatusId,
                    {$this->table}.cityId,
                    {$this->table}.stationId,
                    levelAccess.userTypeId,
                    user.deviceToken,
                    user.api_token
                FROM {$this->table}
                INNER JOIN user ON user.idUser = {$this->table}.userId
                INNER JOIN levelAccess ON levelAccess.userId = user.idUser
                WHERE user.idUser = :userId
                  AND user.statusId = :statusId
                LIMIT 1
            ", [
                ":userId" => $request->userId,
                ":statusId" => User::STATUS_ATIVO,
            ])->first();

            if (empty($authenticate))
                throw new Exception("Usuário não encontrado");

            $tokens =
                (new UserDao)->updateTokens($authenticate->idUser, $request->deviceToken);

            $authenticate->deviceToken = $tokens['deviceToken'];
            $authenticate->api_token = $this->encryptApiToken($tokens['api_token']);

            $authenticate = $this->service->getReasons($authenticate);
            $appVersion = $this->getDriverAppVersion();
            $authenticate->appVersion = $appVersion->version;
            $authenticate->versionIsCritical = (bool)$appVersion->isCritical;

            $log = new Log(LogType::PROCESS);
            $log->setData($authenticate)
                ->setIdReference($authenticate->idDriver)
                ->setUserId($authenticate->idUser)
                ->setApp(LogApp::DRIVER)
                ->setMessage("Login Efetuado");

            (new LogDao)->insert($log);

            return $authenticate;
        } catch (Exception $e) {
            $message = $e->getMessage();

            if (!empty($authenticate))
                $message .= " |Email: " . $authenticate->email;

            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $email
     * @return array|mixed
     * @throws Exception
     */
    public function checkEmail($email)
    {
        $userTable = (new User)->getTableName();
        try {
            $sql = "
                SELECT
                    u.email
                FROM {$userTable} u
                  INNER JOIN {$this->table} d ON d.userId = u.idUser
                WHERE u.email = :email AND u.statusId = :statusId
            ";

            $user = $this->sqlRawSelect($sql, [
                ':email' => $email,
                ':statusId' => User::STATUS_ATIVO
            ])
                ->get(false);

            if (empty($user))
                throw new Exception("Usuário não encontrado: $email");

            return $user;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function checkPhone($phone)
    {
        $userTable = (new User)->getTableName();
        try {
            $sql = "
            SELECT
                u.phone
            FROM {$userTable} u
              INNER JOIN {$this->table} d ON d.userId = u.idUser
            WHERE clearPhone(u.phone) = :phone AND u.statusId = :statusId
            ";
    
            $user = $this->sqlRawSelect($sql, [
                ':phone' => FormatValue::formatPhoneClear($phone),
                ':statusId' => User::STATUS_ATIVO,
            ])
                ->get(false);
    
            if (empty($user))
                throw new Exception('Usuário não encontrado: ' . $phone);
    
            return $user;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }
    

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findAvailable($driverId)
    {
        try {
            return $this->sqlSelect([], [['idDriver', '=', $driverId]])->get(false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @param \app\model\Location $location
     * @param array $listTripsDenied
     * @return array|mixed
     * @throws Exception
     */
    public function searchTrip($driverId, Location $location = null, $listTripsDenied = [])
    {
        try {
            $driver = $this->find($driverId);

            $this->verifyDriverForAcceptTrip(new Driver($driver));

            /**
             * ANTIGO CHAMADO
             */
            //            $resultSql = $tripDrivers->getSqlForSearchTrips(
            //                $driver->idDriver, $listTripsDenied
            //            );
            //            $trips = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])->get();

            /**
             * NOVO CHAMADO
             */
            $trips = $this->tripDriversService
                ->findTripCallingDriver($driver->idDriver, $listTripsDenied);

            if (!empty($location))
                $this->updatePosition($driverId, $location);

            //            if (empty($trips)) {
            //                $tripRealtime = new TripRealtime;
            //                $tripRealtime->deleteAllCallingByDriver($driverId);
            //            }

            (new TripHistoryDao)
                ->insertTripsFound($trips, $driverId);

            $trips = $this->service->calculateTripDistance($trips, $driver->idDriver ?? $driverId);

            return $trips;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function findPosition($driverId)
    {
        return $this->sqlSelect([
            'last_lat AS latitude',
            'last_lon AS longitude'
        ], [
            ['idDriver', '=', ':driverId']
        ], [], 1)
            ->bind([':driverId' => $driverId])
            ->get(false);
    }

    /**
     * @param Driver $driver
     * @throws Exception
     */
    private function verifyDriverForAcceptTrip(Driver $driver)
    {
        if (
            $driver->getStatus() == Driver::OFF ||
            (!(bool)$driver->getPreAvailable() && $driver->getStatus() == Driver::IN_TRIP)
        )
            throw new Exception("Status do motorista não permite nova corrida ID: " . $driver->getIdDriver());

        if ($driver->getDriverRegisterStatusId() != DriverRegisterStatus::ATIVO)
            throw new Exception("Cadastro do motorista não permite nova corrida ID: " . $driver->getIdDriver());
    }

    /**
     * @param $request
     * @param bool $isScheduled
     * @return bool
     * @throws Exception
     */
    public function acceptTrip($request, $isScheduled = false)
    {
        try {
            $tripDao = new TripDao;

            $trip = $tripDao->find($request->tripReference);

            $driverHistory = (new TripHistoryDao)->findByTrip($request->tripReference, $request->driverId);

            $this->validateAccept($trip, $request->driverId);

            $estimative = null;
            if ($trip->isOffer) {
                if (!$trip->estimatedTimeDriverArrival) {
                    $mapsApi = new DirectionService;
                    $driver = new Driver($this->find($request->driverId));

                    $estimative = $mapsApi
                        ->getDistance(
                            $driver->getLastLat(),
                            $driver->getLastLon(),
                            $trip->origin->latitude,
                            $trip->origin->longitude
                        );
                }
            }

            $tripDao->acceptTrip(
                $request->driverId,
                $request->tripReference,
                $request->estimatedTimeDriverArrival ?? $estimative->duration,
                $isScheduled,
                $driverHistory->driverNetValue ?? null
            );

            $this->putInTripAndRemoveCustomerRefused($request->driverId);

            if ($trip->status != Trip::SCHEDULED) {
                $this->bonusRatingService
                    ->insertByAccept();

                if ($trip->status != Trip::GET_BID_BY_DRIVERS) {
                    $this->driverCalledService
                        ->updateStatusDriver($request->tripReference, $request->driverId, DriverCalledConst::ACCEPTED);

                    $this->resetCountNotAnswered($request->driverId);

                    $trip->driverId = $request->driverId;

                    (new DriverService)
                        ->rewardDriverLongDistance(new Trip($trip));
                }
            }

            $trip = $tripDao->find($request->tripReference);

            $this->createLogDriver(
                $trip,
                $trip->tripReference,
                $trip->driver->userId,
                "MOTORISTA ACEITOU A VIAGEM"
            );

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            if ((bool)$trip->deliveryOption)
                backgroundTask('send-delivery-message', "'$trip->tripReference'");

            if ((bool)$trip->onlyCentral)
                backgroundTask('send-central-trip-info-message', "'$trip->tripReference'");

            if ($trip->ride)
                backgroundTask('send-ride-message', "'$trip->tripReference'");

            (new RedisUtil)->set("trip-{$trip->tripReference}", $trip);

            return $trip;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function refuseTrip($driverId, $tripReference)
    {
        try {
            $driver = $this->find($driverId);
            $this->driverCalledService
                ->updateStatusDriver($tripReference, $driverId, DriverCalledConst::REFUSED);

            if ((boolean)Config::get('block_customer_driver'))
                $this->insertCustomerRefused($driverId, $tripReference);

            $this->penaltyService->insertByRefuse($driver->userId);

            $log = new Log(LogType::PROCESS);
            $log->setData($driver)
                ->setIdReference($tripReference)
                ->setUserId($driver->userId)
                ->setApp(LogApp::DRIVER)
                ->setMessage("MOTORISTA RECUSOU UMA VIAGEM");


            return (new LogDao)->insert($log);
            return null;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function informArrival($tripReference)
    {
        try {
            $this->beginTransaction();

            $tripDao = new TripDao;
            $trip = $tripDao->find($tripReference, false);

            if ($trip->status != Trip::ACCEPTED)
                throw new Exception("CORRIDA NÃO ESTA MAIS ATIVA");

            $trip->status = Trip::BOARDING;
            $trip->tripAuditId = $this->auditTrip($trip);

            $tripDao->informArrival($tripReference, $trip->tripAuditId);

            $this->sendPushOnArrival($trip);

            if ($trip->tripCustomerId)
                $trip->resultSms = (new TripCustomerService)
                    ->notifyOnDriverArrival(new Trip($trip), new TripCustomer($trip->customer));

            if ($trip->tripPaymentFormId == TripPaymentFormConst::CREDIT_CARD)
                $trip->paymentInfo = $this->getCustomerCardInfo(new Trip($trip));

            $this->createLogDriver(
                $trip,
                $trip->tripReference,
                $trip->driver->userId,
                "MOTORISTA CHEGOU AO PONTO DE ORIGEM"
            );

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            (new RedisUtil)->set("trip-{$tripReference}", $trip);

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            $this->commit();

            return $trip;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @param $tripReference
     * @param $cancellationReasonsId
     * @param bool $generateCancellationFee
     * @return array|mixed
     * @throws Exception
     */
    public function cancelTrip($driverId, $tripReference, $cancellationReasonsId, bool $generateCancellationFee = true)
    {
        try {
            $this->beginTransaction();
            $tripDao = new TripDao;

            $trip = $tripDao->find($tripReference);

            $this->validateCancelTrip($trip->status);
            //            $driver = $this->find($driverId, false);

            if ($trip->status == Trip::SCHEDULED && $trip->userId <> Headers::getUserId()) {
                $trip = (new DriverTripScheduled)->cancel($tripReference);
                $this->commit();

                return $trip;
            }

            $tripDao->cancelByDriver($tripReference, $cancellationReasonsId);

            $customerCancelFee = $generateCancellationFee ? $this->tripCancellationCustomerFeeService
                ->insert(new Trip($trip), new Driver($trip->driver), new Location($trip->origin)) : null;

            $wasScheduled = ($trip->status == Trip::SCHEDULED);

            $trip->status = Trip::CANCELED;
            $trip->canceledBy = Trip::CANCELED_BY_DRIVER;

            $this->putAvailable($driverId);

            $this->penaltyService->insertByCancellation(Headers::getUserId(), $tripReference, $customerCancelFee);

            if ((bool)Config::get('block_customer_driver'))
                $this->insertCustomerRefused($driverId, $tripReference, $trip->userId);

            $this->manageTripPaymentOnCancel(new Trip($trip), $customerCancelFee);

            $customerUser = (new UserDao)
                ->find($trip->userId, ['deviceToken']);

            $this->notifyCustomerOnCancelTrip($customerUser->deviceToken, $driverId, $cancellationReasonsId, $wasScheduled);

            $logData = (object)[
                'tripReference' => $trip->tripReference,
                'userId' => Headers::getUserId(),
                'data' => $trip
            ];

            $this->createLogDriver(
                $logData,
                $trip->tripReference,
                Headers::getUserId(),
                "VIAGEM CANCELADA PELO MOTORISTA",
                LogCriticalType::AVISO
            );

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            $this->deleteRealtime($trip->tripReference);
            (new RedisUtil)->delete("trip-{$trip->tripReference}");

            $this->commit();

            return $trip;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $deviceToken
     * @param int $driverId
     * @param false $scheduledTrip
     * @return array|mixed|null
     * @throws PushException
     */
    private function notifyCustomerOnCancelTrip($deviceToken, int $driverId, int $cancellationReasonsId = null, $scheduledTrip = false)
    {
        if (!$deviceToken)
            return null;

        $pushConfig = (new PushConfigDao())->find('cancel_trip');

        $driverType = $this->find($driverId)->userTypeName;

        $cancellationReason = $cancellationReasonsId ? (new CancellationReasonsDao())->find($cancellationReasonsId) : null;

        $pushConfig->setMessage(str_replace('{driverType}', $driverType, $pushConfig->getMessage()) . ($cancellationReason ? ", pois, " . $cancellationReason->name : ""));

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle($pushConfig->getTitle() . ($scheduledTrip ? " AGENDADA" : ""))
            ->setAction(PushActionConst::NOTIFY_CUSTOMER_ON_TRIP_EXPIRED)
            ->setTag(PushTagConst::NOTIFY_CUSTOMER_ON_TRIP_EXPIRED)
            ->setBody($pushConfig->getMessage());

        return $push->sendNotification();
    }

    /**
     * @param $status
     * @throws Exception
     */
    private function validateCancelTrip($status)
    {
        if ($status == Trip::CANCELED)
            throw new Exception("Viagem já cancelada");

        if ($status == Trip::FINISHED)
            throw new Exception("Viagem já finalizada");
    }

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function initTrip($tripReference)
    {
        try {
            $tripDao = new TripDao;
            $trip = $tripDao->find($tripReference);

            if ($trip->status != Trip::BOARDING) {
                throw new Exception("Motorista não informou a chegada!");
                (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);
            }

            $tripLongDistanceValue = (new TripLongDistanceValueDao)
                ->findByDriverAndTrip($trip->idTrip, $trip->driverId);

            $recalculatedTripPrice = (new RecalculatedTripDao)
                ->findByTripAndRecalculatedTripType($tripReference, RecalculatedTripTypeConst::LONG_DISTANCE_RECALCULATION);

            if (!empty($tripLongDistanceValue) && empty($recalculatedTripPrice)) {
                (new RecalculatedPriceService)->create((object)[
                    'tripReference' => $tripReference,
                    'oldPrice' => $trip->price,
                    'newPrice' => ($trip->price + $tripLongDistanceValue->value)
                ], RecalculatedTripTypeConst::LONG_DISTANCE_RECALCULATION);

                $trip = $tripDao->find($tripReference);
            }

            $trip->status = Trip::IN_PROGRESS;
            $trip->tripAuditId = $this->auditTrip($trip);

            $tripDao->initTrip($tripReference, $trip->tripAuditId);

            $this->createLogDriver(
                $trip,
                $trip->tripReference,
                $trip->driver->userId,
                "MOTORISTA INICIOU A VIAGEM"
            );

            (new RedisUtil)->set("trip-{$tripReference}", $trip);

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            return $trip;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $idWayPoint
     * @return array|mixed
     * @throws Exception
     */
    public function confirmWayPoint($idWayPoint)
    {
        try {
            $tripDao = new TripDao;
            $tripWayPoint = $this->tripWayPointService->find($idWayPoint);

            if ($tripWayPoint->getConfirmed() == true)
                throw new DriverException(504);

            $trip = $tripDao->find($tripWayPoint->getTripReference(), false);

            if ($trip->status != Trip::IN_PROGRESS)
                throw new TripException(209);

            $trip->tripAuditId = $this->auditTrip($trip, $tripWayPoint);

            $tripDao->updateAudit($trip->tripReference, $trip->tripAuditId);

            $this->tripWayPointService->confirm($tripWayPoint->getId());

            $trip = $tripDao->find($tripWayPoint->getTripReference(), false);

            $trip->confirmedWayPoint = $tripWayPoint->toStdClass();

            $this->createLogDriver(
                $trip,
                $trip->tripReference,
                Headers::getUserId(),
                "MOTORISTA CONFIRMOU UM PONTO DE PARADA"
            );

            (new RedisUtil)->set("trip-{$trip->tripReference}", $trip);

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            return $trip;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @param null $data
     * @return array|mixed
     * @throws Exception
     */
    public function finishTrip($tripReference, $data = null)
    {
        $needsRollback = false;

        try {
            $tripDao = new TripDao;
            $userDiscountCouponDao = new UserDiscountCouponDao;
            $trip = $tripDao->find($tripReference);

            if (!empty($data)) {
                $trip->driver->location = $data->location ?? null;
                if (isset($data->location->latitude) && isset($data->location->longitude))
                    $this->updatePosition($trip->driverId, new Location($data->location));
            }

            $date = $data->date ?? now();

            if ($trip->status != Trip::IN_PROGRESS) {
                throw new Exception("Corrida indisponível para finalização");
            }

            $trip->status = Trip::FINISHED;
            $trip->endDate = $date;
            $trip->tripAuditId = $this->auditTrip($trip);

            $tripDao->finishTrip($tripReference, $date, $trip->tripAuditId);

            $this->beginTransaction();
            $needsRollback = true;

            $this->putAvailable($trip->driverId);

            $this->driverRewardTripService->toAwardDriver(
                new Trip($trip),
                new Driver($trip->driver)
            );

            $balances = $this->splitPayment(new Trip($trip), $trip->tripDiscountCoupon);

            $this->customerTripPaymentService->tripPaymentOnFinish(new Trip($trip));

            (new DriverReferralMonetizationService)
                ->monetizeSponsors(new Driver($trip->driver), new Trip($trip));

            (new TripCashbackService)
                ->payCashback(new Trip($trip));

            $trip->driver->balance = $balances['driverBalance'];

            if (!empty($trip->tripDiscountCoupon) && (bool)$userDiscountCouponDao->find($trip->tripDiscountCoupon->userDiscountCouponId)->uniqueUse) {
                $userDiscountCouponDao->useCoupon($trip->tripDiscountCoupon->userDiscountCouponId);
            }

            if (!empty($trip->customer->totem) && $trip->customer->totem) {
                $this->tripReceiptService->sendToCustomer($tripReference);
            }

            $logMessage = "MOTORISTA FINALIZOU A VIAGEM ";
            $this->createLogDriver(
                $trip,
                $trip->tripReference,
                $trip->driver->userId,
                !empty($data) ? $logMessage . "OFFLINE" : $logMessage
            );

            (new UserService())->updateQuantityTrips($trip->userId);

            /**
             * Atributo necessário para front-end
             */
            $trip->ecoInfo = null;

            $this->deleteRealtime($trip->tripReference);
            (new RedisUtil)->delete("trip-{$trip->tripReference}");

            $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';
            exec(
                "cd {$consolePath} && nohup /usr/bin/php command.php update-quantity-trips {$trip->userId} {$trip->driverId} > /dev/null 2>&1 & echo $!"
            );

            exec(
                "cd {$consolePath} && nohup /usr/bin/php command.php save-route-tracing {$tripReference} > /dev/null 2>&1 & echo $!"
            );

            exec(
                "cd {$consolePath} && nohup /usr/bin/php command.php queue-finished-trip {$tripReference} > /dev/null 2>&1 & echo $!"
            );

            $this->commit();

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            return $trip;
        } catch (Exception $e) {
            if ($needsRollback === true) {
                $this->rollback();
            }
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    private function deleteRealtime($tripReference)
    {
        (new MessagesChatTripRealtime)
            ->deleteAll($tripReference);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();

        (new TripRouteRealtime)
            ->setDocumentId($tripReference)
            ->delete();
    }

    /**
     * @param $idDriver
     * @param bool $withLocation
     * @param bool $withBalance
     * @return array|mixed
     * @throws Exception
     */
    public function find($idDriver, $withLocation = true, $withBalance = false)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        try {
            $driver = $this->sqlRawSelect("
                SELECT
                    {$this->table}.idDriver,
                    {$this->table}.userId,
                    {$this->table}.status,
                    {$this->table}.driverRegisterStatusId,
                    {$this->table}.last_lat AS latitude,
                    {$this->table}.last_lon AS longitude,
                    {$this->table}.profileImage,
                    {$this->table}.profileImageTemp,
                    CONCAT(c.value, 'driver/profile/', {$this->table}.profileImage) AS profilePicture,
                    {$this->table}.balanceId,
                    {$this->table}.stationId,
                    {$this->table}.prepaid,
                    {$levelAccessTable}.userTypeId,
                    uT.name as userTypeName,
                    FORMAT(
                      calculateDriverRating({$this->table}.userId),
                      2,
                      'de_DE'
                    ) AS driverRating,
                    {$userTable}.name,
                    {$userTable}.nickname,
                    {$userTable}.email,
                    {$userTable}.phone,
                    {$userTable}.document,
                    {$userTable}.deviceToken,
                    {$this->table}.preAvailable,
                    {$this->table}.cityId,
                    {$userTable}.bankAccountId,
                    {$userTable}.rating,
                    {$userTable}.quantityTrips,
                    iMD.link AS iconMapDriver,
                    {$this->table}.prepaid
                FROM {$this->table}
                  INNER JOIN {$userTable} ON {$userTable}.idUser = {$this->table}.userId
                  INNER JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = {$userTable}.idUser
                  INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                  INNER JOIN userType uT on {$levelAccessTable}.userTypeId = uT.idUserType
                  LEFT JOIN iconMapDriver iMD on uT.iconMapDriverId = iMD.id
                  WHERE idDriver = :idDriver
            ", [":idDriver" => $idDriver])->get(false);

            $location = $withLocation ?
                (new Location($driver))->toStdClass() :
                null;

            if (!empty($location)) {
                unset($location->registered_at);
                $driver->location = $location;
            }

            if ($withBalance)
                $driver->balance = (new BalanceDao)
                    ->find($driver->balanceId);

            if ($driver)
                $driver->car = (new CarDao)
                    ->getByDriverForTrip($idDriver);

            return $driver;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findWithPendencies($driverId)
    {
        if (!$driverId)
            throw new Exception("ID do motorista não enviado");

        $driver = $this->findSimple($driverId, [
            'idDriver',
            'cityId',
            'userId',
            'driverRegisterStatusId',
            'status'
        ]);

        if (!$driver)
            throw new Exception("Motorista não encontrado");

        $driver->driverRegisterStatus = (new DriverRegisterStatusDao)
            ->find($driver->driverRegisterStatusId);

        $driver = $this->service->getReasons($driver);

        return $driver;
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findAvaliations($driverId)
    {
        if (!$driverId)
            throw new Exception("ID do motorista não enviado");

        $driver = $this->findSimpleAvaliations($driverId);

        if (!$driver)
            throw new Exception("Motorista não encontrado");

        return $driver;
    }

    /**
     * @param $userId
     * @param bool $withLocation
     * @return array|mixed
     * @throws Exception
     */
    public function findByUserId($userId, $withLocation = true, $withBalance = false)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        try {
            $driver = $this->sqlRawSelect("
                SELECT
                    {$this->table}.idDriver,
                    user.idUser,
                    {$this->table}.userId,
                    {$this->table}.status,
                    {$this->table}.last_lat AS latitude,
                    {$this->table}.last_lon AS longitude,
                    {$this->table}.profileImage,
                    {$levelAccessTable}.userTypeId,
                    {$userTable}.name,
                    {$userTable}.nickname,
                    {$userTable}.phone,
                    {$userTable}.deviceToken,
                    {$this->table}.cityId,
                    {$this->table}.prepaid,
                    {$this->table}.balanceId
                FROM {$this->table}
                  INNER JOIN {$userTable} ON {$userTable}.idUser = {$this->table}.userId
                  INNER JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = {$this->table}.userId
                WHERE {$this->table}.userId = :userId
            ", [":userId" => $userId])->get(false);

            $location = $withLocation ?
                (new Location($driver))->toStdClass() :
                null;

            if (!empty($location))
                $driver->location = $location;

            if ($withBalance)
                $driver->balance = (new BalanceDao)
                    ->find($driver->balanceId);

            return $driver;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $idDriver
     * @return array|mixed
     * @throws Exception
     */
    public function findWithTrip($idDriver)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        try {
            $driver = $this->sqlRawSelect(
                /** @lang sql */
                "
                SELECT
                    d.idDriver,
                    d.userId,
                    d.status,
                    d.balanceId,
                    d.stationId,
                    d.driverRegisterStatusId,
                    drs.name AS driverRegisterStatus,
                    d.cnh,
                    user.document,
                    d.crlv,
                    d.profileImage,
                    d.profileImageTemp,
                    d.profileImageStatusId,
                    ds.name AS profileImageStatus,
                    {$levelAccessTable}.userTypeId,
                    ut.name AS driverType,
                    ut.isDeliveryMan,
                    d.last_lat AS latitude,
                    d.last_lon AS longitude,
                    d.preAvailable,
                    d.prepaid,
                    d.cityId,
                    {$userTable}.name,
                    {$userTable}.nickname,
                    {$userTable}.phone,
                    {$userTable}.cooperativeId,
                    {$userTable}.quantityTrips AS total_finished_trip,
                    {$userTable}.rating
                FROM {$this->table} d
                  INNER JOIN {$userTable} ON {$userTable}.idUser = d.userId
                  INNER JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = d.userId
                  INNER JOIN userType ut on levelAccess.userTypeId = ut.idUserType
                  INNER JOIN driverRegisterStatus drs ON d.driverRegisterStatusId = drs.idDriverRegisterStatus
                  LEFT JOIN docStatus ds ON d.profileImageStatusId = ds.id
                WHERE idDriver = :idDriver;
            ",
                [
                    ":idDriver" => $idDriver,
                ]
            )->get(false);

            if (!$driver)
                throw new DriverException(502, ['sended' => $idDriver]);

            $driver->car = (new CarDao)
                ->getByDriverForTrip($idDriver);

            if ($driver->status == Driver::IN_TRIP) {
                $trip = (new TripDao)->findCurrentByDriver($idDriver, true, true);
                $driver->preAvailableTrip = null;

                if (isset($trip[0])) {
                    $driver->trip = $trip[0];
                    $driver->preAvailableTrip = $trip[1] ?? null;
                }

                if (empty($driver->trip) && !$driver->preAvailableTrip) {
                    $this->putAvailable($driver->idDriver);
                    $driver->status = Driver::AVAILABLE;
                }
            }

            $driver->appVersion = $this->getDriverAppVersion();
            $driver->tripTypes = (new TripTypeDriverDao)->findTripTypes($driver->userTypeId);
            $driver->referralMonetization = $this->mountReferralMonetization($driver->userId, $driver->cityId);

            if ($driver->driverRegisterStatusId != DriverRegisterStatus::ATIVO)
                $driver = $this->service->getReasons($driver);

            return $driver;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    private function mountReferralMonetization($userId, $cityId)
    {
        return (new ReferralMonetizationDao)
            ->findUserLevelWithProgress($userId, $cityId);
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findWithAccountInfo($driverId)
    {
        $userTable = (new User)->getTableName();
        $balanceTable = (new Balance)->getTableName();
        $bankTable = (new Bank)->getTableName();
        $bankAccountTable = (new BankAccount)->getTableName();
        $driverAddress = (new DriverAddress)->getTableName();
        $sql = "
            SELECT
              u.idUser,
              {$this->table}.idDriver,
              u.name,
              ba.document,
              b.balance,
              u.dateOfBirth,
              b.idBalance,
              {$bankTable}.bankName,
              ba.idBankAccount,
              ba.holderName,
              ba.agency,
              ba.agencyDigit,
              ba.op,
              ba.numberAccount,
              ba.numberAccountDigit,
              ba.pix,
              da.zipCode,
              da.street,
              da.number,
              da.neighborhood,
              da.complement,
              da.city,
              da.state
            FROM {$this->table}
              INNER JOIN {$userTable} u on {$this->table}.userId = u.idUser
              INNER JOIN {$balanceTable} b on {$this->table}.balanceId = b.idBalance
              LEFT JOIN {$driverAddress} da on {$this->table}.idDriver = da.driverId
              INNER JOIN {$bankAccountTable} ba on u.bankAccountId = ba.idBankAccount
              INNER JOIN {$bankTable} on ba.bankId = {$bankTable}.idBank
            WHERE {$this->table}.idDriver = :idDriver
        ";

        $driverInfo = $this->sqlRawSelect($sql, [':idDriver' => $driverId])
            ->get(false);

        if (!$driverInfo)
            throw new Exception("Motorista não possui conta bancaria");

        return $driverInfo;
    }

    public function findSimple($idDriver, $fields = [])
    {
        return $this->sqlSelect($fields, [['idDriver', '=', ':idDriver']])
            ->bind([':idDriver' => $idDriver])
            ->get(false);
    }

    public function findSimpleAvaliations($idDriver)
    {
        $driver = $this->sqlRawSelect("
        SELECT
        {$this->table}.idDriver,
        {$this->table}.userId,
        {$this->table}.status,
        {$this->table}.driverRegisterStatusId,
        {$this->table}.last_lat AS latitude,
        {$this->table}.last_lon AS longitude,
        {$this->table}.profileImage,
        {$this->table}.profileImageTemp,
        SUBSTRING_INDEX(GROUP_CONCAT(trt.comment), ',', 20) AS comments,
        SUBSTRING_INDEX(GROUP_CONCAT(trt.rating), ',', 20) AS ratings,
        {$this->table}.balanceId,
        {$this->table}.stationId,
        u.created_at,
        {$this->table}.prepaid
    FROM {$this->table}
    INNER JOIN user u ON u.idUser = {$this->table}.userId
    LEFT JOIN tripRating trt ON trt.ratedUser = {$this->table}.userId
    WHERE {$this->table}.idDriver = :idDriver
    AND trt.comment <> ''
    GROUP BY {$this->table}.idDriver
", [":idDriver" => $idDriver])->get(false);

        try {
            $commentsArray = array_filter(array_map('trim', explode(",", $driver->comments))) ?? [];
            $ratingsArray = array_filter(array_map('trim', explode(",", $driver->ratings))) ?? [];

            $avaliations = [];
            foreach ($commentsArray as $key => $comment) {
                $rating = isset($ratingsArray[$key]) ? $ratingsArray[$key] : null;
                $avaliations[] = [
                    'comment' => $comment,
                    'rating' => $rating
                ];
            }

            $driver->avaliations = $avaliations;
            // Remover as chaves antigas do objeto $driver
            unset($driver->comments);
            unset($driver->ratings);
        } catch (Exception $e) {
        }
        $driver->experience = diffInYears($driver->created_at, now()) ?? null;

        return $driver;
    }

    /**
     * @param $idDriver
     * @return bool
     * @throws Exception
     */
    public function putAvailable($idDriver)
    {
        $tripDao = new TripDao;
        $trips = $tripDao->findCurrentByDriver($idDriver, false);
        $status = empty($trips) ?
            Driver::AVAILABLE : Driver::IN_TRIP;

        if (
            $status == Driver::IN_TRIP &&
            count($trips) == 1 &&
            $trips[0]->status == Trip::PRE_ACCEPTED
        ) {
            $tripDao->updateStatus(Trip::ACCEPTED, $trips[0]->tripReference);
            (new RedisUtil)->delete("trip-{$trips[0]->tripReference}");

            $this->tripRealtime
                ->hydrate($trips[0])
                ->setStatus(Trip::ACCEPTED)
                ->updateTrip();
        }

        return $this->sqlUpdate(
            [
                'status' => ':status',
                'preAvailable' => 0,
            ],
            [['idDriver', '=', ':idDriver']],
            [':status' => $status, ':idDriver' => $idDriver]
        );
    }

    /**
     * @param $driverId
     * @param null $status
     * @param null $location
     * @return array|mixed
     * @throws Exception
     */
    public function toggleStatus($driverId, $cityId, $status = null, $location = null)
    {
        try {
            $user = $this->find($driverId, false, false);
            $creditPrepaidDriver = (new CreditPrepaidPurchaseDao)->findByUser($user->userId);

            $configPrepaidPerPeriod = null;
            $cityConfig = (new CityConfigDao)->getByCity($cityId);

            if ($cityConfig->prepayPerPeriod !== "0") {
                $configPrepaidPerPeriod = $cityConfig->prepayPerPeriod == "2" ? 1 : 0;
            } else {
                $configPrepaidPerPeriod = Config::get('only_prepaid_per_period');
            }

            $driver = new Driver($user);

            if ($driver->getPrepaid() && $configPrepaidPerPeriod && !$creditPrepaidDriver && $status !== Driver::OFF) {
                throw new Exception("Você precisa comprar mais dias para ficar ativo!");
            }

            $driver->toggleStatus();

            if ($status && $this->validateStatusChange($status))
                $driver->setStatus($status);

            $this->updateStatus($driverId, $driver->getStatus());

            if ($driver->getStatus() == Driver::OFF)
                $this->resetCountNotAnswered($driverId, $driver->getStatus());

            $this->driverOnlineTimeService
                ->updateStatus($driver);

            $user->status = $driver->getStatus();

            if ($location) {
                $this->updatePosition($driverId, new Location($location));
                $user->location = $location;
            }

            $status_realtime_database = (boolean)Config::get('cloud_firestore');

            $log = new Log(LogType::PROCESS);
            $log->setData($user)
                ->setIdReference($driver->getIdDriver())
                ->setUserId($driver->getUserId())
                ->setApp(LogApp::DRIVER)
                ->setMessage("MOTORISTA ALTEROU SEU STATUS");

            (new LogDao)->insert($log);

            return array_merge(
                $driver->toArray(),
                compact('status_realtime_database')
            );
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $status
     * @return bool
     * @throws DriverException
     */
    private function validateStatusChange($status)
    {
        if ($status != Driver::OFF && $status != Driver::AVAILABLE)
            throw new DriverException(505, compact($status));

        return true;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function getTrips($request)
    {
        try {
            $tripDao = new TripDao;
            $resultWhere = $this->service->getWhereForGetTrips($request);

            $count = $tripDao->sqlSelect(['COUNT(*) AS totalRows'], $resultWhere['where'])
                ->bind($resultWhere['bind'])
                ->get(false);

            $resultSql = $this->service->getSqlForGetTrips($count->totalRows, $resultWhere['where'], $request->page ?? null);

            $trips = $tripDao->sqlRawSelect($resultSql['sql'], $resultWhere['bind'])->get();

            return [
                "paginate" => $resultSql['paginationInfo'],
                "trips" => $trips
            ];
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function getTripsActives($request)
    {
        $tripDao = new TripDao;
        $resultSql = $this->service->getSqlForGetTripsActives(
            $request->driverId
        );

        $trips = $tripDao->sqlRawSelect($resultSql['sql'])->get();

        return [
            "trips" => $trips
        ];
    }

    /**
     * @param $email
     * @return mixed
     * @throws Exception
     */
    public function forgotPassword($email)
    {
        $userTable = (new User)->getTableName();

        $sql = "
            SELECT
                u.phone,
                u.email,
                d.cityId
            FROM {$userTable} u
              INNER JOIN {$this->table} d on d.userId = u.idUser
            WHERE u.email = :email
              LIMIT 1
        ";

        $driver = $this->sqlRawSelect($sql, [':email' => $email])
            ->first();

        if (!$driver)
            throw new Exception("Motorista não encontrado");

        $result = (new Driver())->sendRecoveryCode($driver->phone, $driver->cityId);
        $appTitle = Config::get('app_title');

        $result['email'] = Email::sendMail(
            $driver->email,
            "Confirmação de email",
            "{$appTitle}: Confirmação de email",
            "
                <h3>Seu código de confirmação é: {$result['sms']}</h3>"
        );

        return $result;
    }

    /**
     * @param $email
     * @param $password
     * @return bool
     * @throws Exception
     */
    public function changePassword($email, $password)
    {
        $sql = "
            SELECT
                u.*
            FROM user u
              INNER JOIN driver d on u.idUser = d.userId
            WHERE 
              u.email = :email AND
              u.statusId = 1
              LIMIT 1
        ";

        $user = $this->sqlRawSelect($sql, [
            ':email' => $email
        ])
            ->get(false);

        if (!$user)
            throw new Exception("Motorista não encontrado: " . $email);

        $user = new User($user);
        $user->setPassword($password);

        return (new UserDao)->sqlUpdate(
            ['password' => ':password'],
            [['idUser', '=', ':idUser']],
            [
                ':password' => $user->getPassword(),
                ':idUser' => $user->getIdUser()
            ]
        );
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function edit($request)
    {
        try {

            $userDao = new UserDao;

            $editMounted = $this->service->mountEditDriver($request);

            $userDao->sqlUpdate($editMounted['set'], [$editMounted['where']], $editMounted['bind']);

            $driver = $this->find($request->driverId, false);

            $log = new Log(LogType::PROCESS);
            $log->setData($driver)
                ->setIdReference($driver->idDriver)
                ->setUserId($driver->userId)
                ->setApp(LogApp::DRIVER)
                ->setMessage("MOTORISTA EDITOU SUAS INFORMAÇÕES");

            (new LogDao)->insert($log);

            return $driver;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @return mixed
     * @throws Exception
     */
    public function reprovedPhotoProfile($driverId)
    {
        $set = ['profileImageStatusId' => ':profileImageStatusId'];
        $bind = [':profileImageStatusId' => DocUserConst::REPROVED];

        $set += ['driverRegisterStatusId' => ':driverRegisterStatusId'];
        $bind += [':driverRegisterStatusId' => DriverRegisterStatus::PENDENTE];

        return $this->sqlUpdate($set, [['idDriver', '=', $driverId]], $bind);
    }

    /**
     * @param $driverId
     * @param $photo
     * @param bool $notifyAdmin
     * @return mixed
     * @throws Exception
     */
    public function editProfileImage($driverId, $photo, bool $notifyAdmin = true)
    {
        $driver = $this->find($driverId, false);

        $photoName = null;

        if (is_string($photo)) {
            $photoName = $photo;
        } else {
            $photoName = $this->service->updateProfileImage($photo, $driver->profileImageTemp);
        }

        $key = 'profileImageTemp';

        $set = [$key => ':profileImage'];
        $bind = [
            ':profileImage' => $photoName,
            ':idDriver' => $driverId
        ];

        if ((bool)Config::get('driver_profile_image_init_pending')) {
            $set += ['profileImageStatusId' => ':profileImageStatusId'];
            $bind += [':profileImageStatusId' => DocUserConst::IN_ANALYSIS];
        }

        $this->sqlUpdate($set, [['idDriver', '=', ':idDriver']], $bind);

        $driver->$key = $photoName;

        if ($notifyAdmin) {
            $adminNotificationType =
                (new AdminNotificationTypeDao)->find(AdminNotificationTypeConst::PROFILE_IMAGE_UPDATE);

            $adminNotification = new AdminNotification;
            $adminNotification
                ->setUserId($driver->userId)
                ->setIp($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'])
                ->setAdminNotificationTypeId(AdminNotificationTypeConst::PROFILE_IMAGE_UPDATE)
                ->setUserGroupId(UserGroupConst::DRIVER)
                ->setMessage(str_replace('{userName}', $driver->name, $adminNotificationType->defaultMessage))
                ->setTitle($adminNotificationType->name)
                ->setCityId($driver->cityId ?? null)
                ->setId(
                    (new AdminNotificationDao)
                        ->sqlInsert($adminNotification)
                );
        }

        return $photoName;
    }

    public function editNewProfileImage($driverId, $photo)
    {
        $driver = $this->find($driverId, false);

        $photoName = $this->service
            ->updateProfileImage($photo, $driver->profileImageTemp, false);

        $key = 'profileImage';

        $set = [$key => ':profileImage'];
        $bind = [
            ':profileImage' => $photoName,
            ':idDriver' => $driverId
        ];

        $this->sqlUpdate($set, [['idDriver', '=', ':idDriver']], $bind);

        return $photoName;
    }

    /**
     * @param $driverId
     * @param $photos
     * @return stdClass
     * @throws Exception
     */
    public function editDocsImage($driverId, $photos)
    {
        $driver = new Driver($this->findSimple($driverId));

        $driver = $this->service->updateDocsImages($driver, $photos);

        $this->sqlUpdate(
            [
                'cnhPicture' => ':cnhPicture',
                'crlvPicture' => ':crlvPicture',
                'alvaraPicture' => ':alvaraPicture',
                'driverRegisterStatusId' => ':driverRegisterStatusId',
            ],
            [['idDriver', '=', ':idDriver']],
            [
                ':cnhPicture' => $driver->getCnhPicture(),
                ':crlvPicture' => $driver->getCrlvPicture(),
                ':alvaraPicture' => $driver->getAlvaraPicture(),
                ':driverRegisterStatusId' => DriverRegisterStatus::AGUARDANDO_RESPOSTA,
                ':idDriver' => $driver->getIdDriver()
            ]
        );

        $this->createLogDriver(
            $this->find($driver->getIdDriver(), false),
            $driver->getIdDriver(),
            $driver->getUserId(),
            'MOTORISTA ATUALIZOU SUAS FOTOS DE DOCUMENTOS'
        );

        return $driver->toStdClass();
    }

    /**
     * @param $driverId
     * @param $stationId
     * @return bool
     * @throws Exception
     */
    public function updateDefaultStation($driverId, $stationId)
    {
        try {
            $bind = [':driverId' => $driverId];
            $station = [];

            if ($stationId) {
                $driverStationExists = (new DriverStationDao)
                    ->findActive($driverId, $stationId);

                if (!$driverStationExists)
                    throw new DriverException(500, [
                        'driverId' => $driverId,
                        'stationId' => $stationId
                    ]);

                $bind[':stationId'] = $stationId;

                $station = (new StationDao)
                    ->find($stationId);
            }

            $sql = "UPDATE {$this->table} SET stationId = ";
            $sql .= !$stationId ? "NULL " : ":stationId ";
            $sql .= "WHERE idDriver = :driverId";

            $this->sqlRawUpdate($sql, $bind);

            $this->createLogDriver(
                $station,
                $driverId,
                Headers::getUserId(),
                'MOTORISTA ALTEROU SEU RETURN'
            );
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }

        return $station;
    }

    /**
     * @param $driverId
     * @param $driverAppVersion
     * @return bool
     * @throws Exception
     */
    public function updateDriverAppVersion($driverId, $driverAppVersion)
    {
        return $this->sqlUpdate(
            ['appVersion' => ':appVersion'],
            [['idDriver', '=', ':idDriver']],
            [':appVersion' => $driverAppVersion, ':idDriver' => $driverId]
        );
    }

    /**
     * @param $appIsOpen
     * @param $driverId
     * @return bool
     * @throws Exception
     */
    public function updateAppIsOpen($appIsOpen, $driverId)
    {
        return $this->sqlUpdate(
            ['appIsOpen' => ':appIsOpen'],
            [['idDriver', '=', ':idDriver']],
            [':appIsOpen' => $appIsOpen, ':idDriver' => $driverId]
        );
    }

    /**
     * @param $document
     * @return array|mixed
     * @throws DriverException
     */
    public function checkDocument($document)
    {
        $checkDocumentService = new CheckDocumentService;

        $resultSql = $checkDocumentService->sqlCheckDocument(
            $document,
            implode(',', $this->userTypeDao->getIdsTypeDriver())
        );

        $driver = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if (!$driver)
            throw new DriverException(501);

        return $driver;
    }

    public function checkPassword(User $user)
    {
        $sql = "
            SELECT
                u.idUser,
                u.email
            FROM {$this->table} d
              INNER JOIN user u ON u.idUser = d.userId
            WHERE 
              u.idUser = :userId AND 
              u.password = :password AND
              u.statusId = :statusId
        ";

        $bind = [
            ':userId' => $user->getIdUser(),
            ':password' => $user->getPassword(),
            ':statusId' => Status::ATIVO,
        ];

        $driver = $this->sqlRawSelect($sql, $bind)
            ->get(false);

        return $driver;
    }

    /**
     * @param $userId
     * @param $driverRegisterStatusId
     * @return bool
     * @throws Exception
     */
    public function updateDriverRegisterUserId($userId, $driverRegisterStatusId)
    {
        return $this->sqlUpdate(
            [
                'driverRegisterStatusId' => ':driverRegisterStatusId',
                'status' => ':status',
            ],
            [['userId', '=', ':userId']],
            [
                ':userId' => $userId,
                ':driverRegisterStatusId' => $driverRegisterStatusId,
                ':status' => Driver::OFF,
            ]
        );
    }

    /**
     * @param $idDriver
     * @param $count
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateCountNotAnswered($idDriver, $count, $status = null)
    {
        $set = ['countNotAnswered' => ':countNotAnswered'];
        $bind = [
            ':driverId' => $idDriver,
            ':countNotAnswered' => $count,
        ];

        if ($status) {
            $set['status'] = ':status';
            $bind[':status'] = $status;
        }

        return $this->sqlUpdate(
            $set,
            [['idDriver', '=', ':driverId']],
            $bind
        );
    }

    public function levelDrivers()
    {
        return $this->sqlRawUpdate("
            UPDATE user 
              SET rating = 5 
              WHERE idUser IN 
            (SELECT
              d.userId
            FROM driver d);
        ");
    }

    /**
     * @param $driverId
     * @param $status
     * @return bool
     * @throws Exception
     */
    private function updateStatus($driverId, $status)
    {
        return $this->sqlUpdate(
            [
                'status' => ':status'
            ],
            [['idDriver', '=', ':driverId']],
            [':status' => $status, ':driverId' => $driverId]
        );
    }

    /**
     * @param Trip $trip
     * @param null|TripCancellationCustomerFee $customerCancelFee
     * @return array|mixed
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws Exception
     */
    private function manageTripPaymentOnCancel(Trip $trip, ?TripCancellationCustomerFee $customerCancelFee = null)
    {
        $customer = (new UserDao)
            ->findWithBalance($trip->getUserId());

        return $this->customerTripPaymentService
            ->tripPaymentOnCancel($trip, $customer->balanceId, $customerCancelFee);
    }

    /**
     * @param $trip
     * @param $driverId
     * @throws TripException
     */
    private function validateAccept($trip, $driverId)
    {
        if ($trip->driverId && $trip->status != Trip::SCHEDULED && $trip->driverId != $driverId)
            throw new TripException(201, ['tripReference' => $trip->tripReference]);

        if ($trip->status != Trip::SCHEDULED && !in_array($driverId, explode(',', $trip->callingDriver)))
            throw new TripException(203, ['callingDriver' => $trip->callingDriver]);

        if (!$this->tripIsSearchingDriver($trip->status) || in_array($trip->status, [Trip::BACK_OFF, Trip::NOT_ANSWERED]))
            throw new TripException(202, ['status' => $trip->status]);
    }

    private function tripIsSearchingDriver($status): bool
    {
        if ($status != Trip::SEARCHING && $status != Trip::SEARCHING_FAVORITE && $status != Trip::SCHEDULED && $status != Trip::GET_BID_BY_DRIVERS)
            return false;

        return true;
    }

    /**
     * @param $driverId
     * @param Location $location
     * @throws Exception
     */
    private function updatePosition($driverId, Location $location): void
    {
        $location->setDriverId($driverId);
        (new LocationDao)->insert($location);
    }

    /**
     * @param $data
     * @param $driverId
     * @return Station
     * @throws Exception
     */
    private function attachStation($data, $driverId): Station
    {
        $station = new Station($data);
        $station->setIdStation(
            (new StationDao)->sqlInsert($station)
        );

        $driverStation = new DriverStation;
        $driverStation
            ->setDriverId($driverId)
            ->setStationId($station->getIdStation());

        (new DriverStationDao)->sqlInsert($driverStation);

        $this->insertDefaultStation($driverId, $station->getIdStation());

        return $station;
    }

    /**
     * @param $whoIndicatedId
     * @param $userIndicatedId
     * @param null $cityId
     * @return \app\model\UserIndication
     */
    private function createIndication($whoIndicatedId, $userIndicatedId, $cityId = null): UserIndication
    {
        $dao = new UserIndicationDao;
        $indication = new UserIndication;

        if ($cityId) {
            $config = (new CityConfigDao)
                ->getByCity($cityId);

            if ($config && $config->daysForFeeRefund) {
                $indication
                    ->setRefundToFeesUpTo(
                        addDays(now(), (int)$config->daysForFeeRefund)
                    );
            }
        }

        $indication
            ->setWhoIndicatedId($whoIndicatedId)
            ->setUserIndicatedId($userIndicatedId)
            ->setId(
                $dao->sqlInsert($indication)
            );

        return $indication;
    }

    /**
     * @param $data
     * @param $userId
     * @param array $photos
     * @return Driver
     * @throws Exception
     */
    private function createDriver($data, $userId, array $photos = [], $keyAppPartner = null): Driver
    {

        /** @var Balance $balance */
        $balance = (new BalanceDao)->create();

        $driver = new Driver($data);
        $driver->setUserId($userId);
        $driver->setCnh($data->numberCNH ?? null);
        $driver->setAddressCity($data->addressCity ?? null);
        $driver->setAddressDistrict($data->addressDistrict ?? null);
        $driver->setAddressState($data->addressState ?? null);
        $driver->setAddressNumber($data->addressNumber ?? null);
        // $driver->setAddressCEP($data->addressCEP ?? null);
        $driver->setCrlv($data->numberCRLV ?? null);
        $driver->setHasCardReader(
            isset($data->hasCardReader) && !empty($data->hasCardReader) ? 1 : 0
        );
        $driver->setDriverAttachmentTypeId($data->driverAttachmentTypeId ?? null);

        if(isset($keyAppPartner)) {
            $driver->setAppPartnerKey($keyAppPartner);
        }

        if (isset($photos['PROFILE'])) {
            $resource = $this->resourceDao->findOrFail($photos['PROFILE'], ['path']);
            $driver->setProfileImagePath($resource->path ?? null);
        }

        if (isset($photos['CNH'])) {
            $resource = $this->resourceDao->findOrFail($photos['CNH'], ['path']);
            $driver->setCnhPicturePath($resource->path ?? null);
        }

        if (isset($photos['CRLV'])) {
            $resource = $this->resourceDao->findOrFail($photos['CRLV'], ['path']);
            $driver->setCrlvPicturePath($resource->path ?? null);
        }

        if (isset($photos['ALVARA'])) {
            $resource = $this->resourceDao->findOrFail($photos['ALVARA'], ['path']);
            $driver->setAlvaraPicturePath($resource->path ?? null);
            $driver->setAlvara($data->numberAlvara ?? null);
        }

        if (isset($photos['ADDRESSCONFIRM'])) {
            $resource = $this->resourceDao->findOrFail($photos['ADDRESSCONFIRM'], ['path']);
            $driver->setAddressConfirmPicturePath($resource->path ?? null);
        }

        if (isset($photos['CRIMINAL_RECORD'])) {
            $resource = $this->resourceDao->findOrFail($photos['CRIMINAL_RECORD'], ['path']);
            $driver->setCriminalRecordPicturePath($resource->path ?? null);
            $driver->setCriminalRecord($data->numberCriminalRecord ?? null);
        }

        if (isset($photos['PROOF_OF_RESIDENCE'])) {
            $resource = $this->resourceDao->findOrFail($photos['PROOF_OF_RESIDENCE'], ['path']);
            $driver->setProofOfResidencePath($resource->path ?? null);
        }

        if (Config::get('driver_register_unblocked'))
            $driver->setDriverRegisterStatusId(DriverRegisterStatus::ATIVO);

        $driverProfileImageInitPending = (bool)Config::get('driver_profile_image_init_pending');

        $driver->setProfileImageStatusId(
            $driverProfileImageInitPending ? DocUserConst::IN_ANALYSIS : DocUserConst::APPROVED
        );

        $driver->setBalanceId($balance->getIdBalance());
        $driver->setIdDriver($this->sqlInsert($driver));

        $levelAccess = new LevelAccess;
        $levelAccess->setUserTypeId($data->userTypeId);
        $levelAccess->setUserId($driver->getUserId());

        (new LevelAccessDao)->sqlInsert($levelAccess);

        if ($driverProfileImageInitPending) {
            $resource = $this->resourceDao->findOrFail($photos['PROFILE'], ['path']);
            $this->editProfileImage($driver->getIdDriver(), $resource->path, false);
        }

        return $driver;
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitPayment(Trip $trip, $tripDiscountCoupon)
    {
        try {
            if ($tripDiscountCoupon) {
                $trip->tripDiscountCoupon = $tripDiscountCoupon;
            }
        } catch (Exception $e) {
        }
        try {
            $customer = (new CustomerDao)
                ->findByUser($trip->getUserId());
        } catch (Exception $e) {
            $customer = (new UserDao)
                ->findWithBalance($trip->getUserId());
        }

        if ($customer) {
            /**
             * A variável $customer deve conter o userTypeId na query
             * para identificação se é cliente final ou cliente parceiro
             */
            return $this->splitPaymentInFinishCustomerTrip($trip, $customer);
        }

        return $this->splitPaymentInFinishEstablishmentTrip($trip);
    }

    /**
     * @param Trip $trip
     * @param $customer
     * @return array
     * @throws Exception
     */
    private function splitPaymentInFinishCustomerTrip(Trip $trip, $customer)
    {
        $driver = $this->find($trip->getDriverId(), false);

        $tripPaymentForm = (new TripPaymentFormDao)->find($trip->getTripPaymentFormId());

        if ($trip->getPartnerCommissionId()) (new PartnerSplitTripPaymentService)
            ->splitTripPayment(
                $trip,
                $customer->balanceId,
                new Driver($driver),
                (int) $tripPaymentForm->paymentFormTypeId
            );

        return (new CustomerSplitTripPaymentService)
            ->splitTripPayment(
                $trip,
                $customer->balanceId,
                new Driver($driver),
                (int) $tripPaymentForm->paymentFormTypeId
            );
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitPaymentInFinishEstablishmentTrip(Trip $trip): array
    {
        $establishment = (new EstablishmentDao)
            ->find($trip->getEstablishmentId(), ['balanceId']);

        $driver = $this->find($trip->getDriverId(), false);

        return (new BalanceDao)
            ->distributeBalanceAfterFinishTrip(new Establishment($establishment), new Driver($driver), $trip);
    }

    /**
     * @param Trip $trip
     * @return array|bool
     * @throws Exception
     */
    private function stopCallDrivers(Trip $trip)
    {
        $drivers = (new TripHistoryDao)->getByTrip($trip->getTripReference());

        //        $driverEvent = new DriverChannel;
        //        $batchs = array_map(function ($driver) use ($trip){
        //            return ['name' => $driver->driverId, 'data' => ['trip' => $trip->toStdClass(), 'call' => false]];
        //        }, $drivers);

        $deviceTokens = array_map(function ($driver) {
            return $driver->deviceToken;
        }, $drivers);

        $push = new Push;
        $push
            ->setData(['trip' => $trip->toStdClass(), 'call' => false])
            ->setAction(PushActionConst::STOP_CALL)
            ->setTag(PushTagConst::STOP_CALL);

        return $push->notificationAllWithData($deviceTokens);

        //        return $driverEvent->trigger_batch($batchs);
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
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLogDriver($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }

    /**
     * @param $driverId
     * @return bool
     * @throws Exception
     */
    public function putInTripAndRemoveCustomerRefused($driverId): bool
    {
        return $this->sqlUpdate(
            [
                'status' => ':status',
                'lastCustomerRefused' => 'NULL',
                'preAvailable' => 0
            ],
            [['idDriver', '=', ':idDriver']],
            [':status' => Driver::IN_TRIP, ':idDriver' => $driverId]
        );
    }

    /**
     * @param $email
     * @return bool
     * @throws Exception
     */
    private function sendWelcomeEmail($email)
    {
        $message = Config::get('welcome_email_message', ConfigType::DRIVER);
        $title = Config::get('welcome_email_title', ConfigType::DRIVER);
        $subject = Config::get('welcome_email_subject', ConfigType::DRIVER);

        return Email::sendMail($email, $subject, $title, $message);
    }

    /**
     * @param $trip
     * @param null|\app\model\TripWayPoint $tripWayPoint
     * @return int
     * @throws Exception
     */
    private function auditTrip($trip, ?TripWayPoint $tripWayPoint = null)
    {
        $config = (Boolean)Config::get('block_trip');

        if ($config) {
            return (new TripService)->getUpdateTripAuditId($trip, $tripWayPoint);
        } else {
            return TripAudit::RELEASED;
        }
    }

    /**
     * @param $idDriver
     * @param $idStation
     * @return bool
     * @throws Exception
     */
    private function insertDefaultStation($idDriver, $idStation)
    {
        return $this->sqlUpdate(
            ['stationId' => ':idStation'],
            [['idDriver', '=', ':idDriver']],
            [':idDriver' => $idDriver, ':idStation' => $idStation]
        );
    }

    /**
     * @param Customer $customer
     * @return mixed|null
     * @throws Exception
     */
    private function sendSmsOnFinishTrip(Customer $customer)
    {
        $user = (new CustomerDao)
            ->findWithUser($customer->getIdCustomer());

        if (!$user)
            return $this->service
                ->sendSmsToCustomerAfterTrip($customer);

        return null;
    }

    private function encryptApiToken($api_token)
    {
        return $this->tokenApi->encrypt($api_token);
    }

    /**
     * Retorna o numero da versão do app do motorista
     * @return mixed
     * @throws Exception
     */
    private function getDriverAppVersion()
    {
        return (new AppDao)
            ->getVersion(AppConst::DRIVER, ['version', 'isCritical']);
    }

    /**
     * @Deprecated
     * @param $tripReference
     * @return ?stdClass
     * @throws Exception
     */
    private function mountEcoInfo($tripReference)
    {
        $eco = (new TripEcoDao)
            ->calculateEco($tripReference);

        return isset($eco->ecoKm) ? $eco : null;
    }

    /**
     * @param $trip
     * @return mixed|null
     * @throws PushException
     */
    private function sendPushOnArrival($trip)
    {
        if (!$trip->customerId) {
            $user = (new UserDao)
                ->find($trip->userId, ['deviceToken']);

            $driverType = (new UserTypeDao())->find($trip->driver->userTypeId);

            $push = $this->service
                ->mountDriverArrivalPush(
                    $user->deviceToken,
                    $trip->driver->profileImage,
                    $trip->driver->nickname,
                    $driverType->name
                );

            try {
                return $push->sendNotification();
            } catch (PushException $e) {
                return null;
            }
        }

        return null;
    }

    /**
     * @param $driverId
     * @param $tripReference
     * @param null $customerUserId
     * @return bool
     * @throws Exception
     */
    public function insertCustomerRefused($driverId, $tripReference, $customerUserId = null)
    {
        if (!$customerUserId) {
            $tripDao = new TripDao;
            $trip = $tripDao->findObject($tripReference);

            $customerUserId = $trip->getUserId();
        }

        return $this->sqlUpdate(
            [
                'lastCustomerRefused' => $customerUserId
            ],
            [['idDriver', '=', ':idDriver']],
            [':idDriver' => $driverId]
        );
    }

    /**
     * @param $driverId
     * @param $status
     * @return bool
     * @throws Exception
     */
    private function resetCountNotAnswered($driverId, $status = null)
    {
        return $this->updateCountNotAnswered($driverId, 0, $status);
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function getCustomerCardInfo(Trip $trip)
    {
        $tripCardPayment = $this->tripCardPaymentDao
            ->findByTrip($trip->getTripReference());

        $card = $this->customerCardService
            ->find($tripCardPayment->cardId);

        return $card;
    }

    public function updateQuantityTrips(int $idDriver)
    {
        return $this->sqlRawUpdate(
            "
            UPDATE user
                INNER JOIN driver d on user.idUser = d.userId
            SET quantityTrips = COALESCE(
                    (
                        SELECT COUNT(idTrip)
                        FROM trip
                        WHERE driverId = d.idDriver
                          AND trip.status = 'finished'
                        GROUP BY driverId
                    ), 0)
            WHERE idDriver = :idDriver;
        ",
            [':idDriver' => $idDriver]
        );
    }

    public function checkIsDeliveryMan($idDriver)
    {
        return $this->sqlRawSelect(
            "
            SELECT isDeliveryMan
            FROM driver
                     INNER JOIN levelAccess lA ON driver.userId = lA.userId
                     INNER JOIN userType uT ON lA.userTypeId = uT.idUserType
            WHERE idDriver = :driverId",
            [
                ":driverId" => $idDriver
            ]
        )->get(false);
    }


    public function validateDocumentConfianceBank(int $idDriver)
    {
        $driver = $this->find($idDriver);

        return (new ConfianceValidationPersonalDocument())->validate($driver->document);
    }

    public function findDriversByTrip($tripReference)
    {
        $sql =
            /** @lang sql */
            "
            select
                dC.*
            from trip
                 inner join tripTypeDriver tT on tT.tripTypeId = trip.tripTypeId
                 inner join user uc on trip.userId = uc.idUser
                 inner join customer c on uc.idUser = c.userId
                 inner join (
                    select
                        u.name,
                        driver.idDriver,
                        cA.cityId,
                        u.deviceToken,
                        uT.idUserType as userTypeId
                    from driver
                          inner join user u on driver.userId = u.idUser
                          inner join cityArea cA on (
                             cA.statusId = 1 AND
                             ST_Contains(
                                     cA.polygon,
                                     ST_GeomFromText(CONCAT('POINT(', driver.last_lat, ' ', driver.last_lon, ')'))) =
                             1)
                          inner join levelAccess lA on u.idUser = lA.userId
                          inner join userType uT on lA.userTypeId = uT.idUserType
                    where 
                        cA.statusId = 1 and
                        driver.status = 'disponivel' AND
                        driver.driverRegisterStatusId = :driverStatusActive
                ) dC on trip.cityId = dC.cityId
                left join refusedDriver rd ON 
                    rd.driverId = dC.idDriver AND
                    rd.customerId = c.idCustomer AND 
                    rd.statusId = :statusActive
            where
                tripReference = :tripReference AND
                dC.userTypeId =  tT.userTypeId AND
                rd.id IS NULL";

        return $this->sqlRawSelect(
            $sql,
            [
                ":tripReference"      => $tripReference,
                ":driverStatusActive" => DriverRegisterStatus::ATIVO,
                ":statusActive"       => Status::ATIVO
            ]
        )->get();
    }
}