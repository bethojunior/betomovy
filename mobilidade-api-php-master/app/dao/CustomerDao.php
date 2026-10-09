<?php

namespace app\dao;

use app\constant\AppConst;
use app\constant\CustomerConst;
use app\constant\CustomerRegisterStatusConst;
use app\constant\DocUserConst;
use app\constant\GenderConst;
use app\constant\PartnerRegisterStatusConst;
use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\constant\RecoveryPasswordTypeConst;
use app\constant\TripCallTypeConst;
use app\constant\TripPaymentFormConst;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\CustomerException;
use app\exceptions\DiscountCouponException;
use app\exceptions\DriverCommissionException;
use app\exceptions\DriverException;
use app\exceptions\InvalidFieldBankAccountException;
use app\exceptions\InvalidFieldCustomerException;
use app\exceptions\PushException;
use app\exceptions\ScheduleDateException;
use app\exceptions\TripException;
use app\exceptions\TripPaymentException;
use app\exceptions\UserException;
use DateTime;
use app\model\Balance;
use app\model\BankAccount;
use app\model\City;
use app\model\Config;
use app\model\ConfigType;
use app\model\Customer;
use app\model\DeliveryInfo;
use app\model\Destination;
use app\model\DocUser;
use app\model\Driver;
use app\model\DriverRegisterStatus;
use app\model\Estate;
use app\model\LevelAccess;
use app\model\Location;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\MilitaryUser;
use app\model\NewSocialLogin;
use app\model\Origin;
use app\model\Partner;
use app\model\Place;
use app\model\Status;
use app\model\TollTrip;
use app\model\Trip;
use app\model\TripCancellationCustomerFee;
use app\model\TripCashback;
use app\model\TripItem;
use app\model\TripScheduled;
use app\model\TripTax;
use app\model\User;
use app\model\UserType;
use app\realtime\MessagesChatTripRealtime;
use app\realtime\TripRealtime;
use app\realtime\TripRouteRealtime;
use app\services\AddressService;
use app\services\CheckDocumentService;
use app\services\UserDuplicateCheckService;
use app\services\CityService;
use app\services\CustomerDiscountCouponService;
use app\services\CustomerService;
use app\services\CustomerTripCallService;
use app\services\CustomerTripPaymentService;
use app\services\DriverCalledService;
use app\services\DriverCommissionService;
use app\services\FavoriteDriverService;
use app\services\MinPriceRewardTripService;
use app\services\PendencyFieldService;
use app\services\TripCancellationCustomerFeeService;
use app\services\TripWayPointService;
use app\services\UserService;
use app\utils\BaseDao;
use app\utils\ChannelAbstract;
use app\utils\Connection;
use app\utils\FormatValue;
use app\utils\Headers;
use app\utils\Push;
use app\utils\RedisUtil;
use app\utils\TokenApi;
use app\validator\BankAccountValidator;
use app\validator\CustomerValidator;
use app\validator\TripValidator;
use Cassandra\Custom;
use Exception;
use stdClass;
use app\dao\IntegrationPartnersDao;
use app\queue\Queue;
use app\queue\Jobs\trip\TripWhatsAppNotificationJob;
use app\queue\Jobs\MobilityLiteCancelTripJob;
use app\queue\Jobs\MobilityLiteJob;
use app\services\contracts\TripPaymentService;
use app\utils\Logger;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 24/07/2018
 * Time: 08:43
 */
class CustomerDao extends BaseDao
{
    private $validator;
    /** @var Trip $trip */
    private $trip;
    private $customer;
    private $service;
    private $tokenApi;
    private $tripPaymentService;
    private $tripCallService;
    private $tripValidator;
    private $driverCommissionService;
    private $userDao;
    private $tripWayPointService;
    private $minPriceRewardTripService;
    private $favoriteDriverService;
    private $tripCancellationCustomerFeeService;
    private $tripRealtime;
    private $cityService;
    private $tripTypeDao;
    private $chargedDao;

    /**
     * CustomerDao constructor.
     * @param null $conn
     * @param string $sql
     */
    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->validator = new CustomerValidator;
        $this->tripValidator = new TripValidator;
        $this->driverCommissionService = new DriverCommissionService;
        $this->service = new CustomerService;
        $this->tripPaymentService = new CustomerTripPaymentService;
        $this->tripCallService = new CustomerTripCallService;
        $this->tripWayPointService = new TripWayPointService;
        $this->minPriceRewardTripService = new MinPriceRewardTripService;
        $this->favoriteDriverService = new FavoriteDriverService;
        $this->tripCancellationCustomerFeeService = new TripCancellationCustomerFeeService;
        $this->cityService = new CityService;
        $this->userDao = new UserDao;
        $this->tokenApi = new TokenApi;
        $this->tripRealtime = new TripRealtime;
        $this->tripTypeDao = new TripTypeDao;
        $this->chargedDao = new TurbochargedPriceDao;
        parent::__construct($conn, $sql);
    }

    /**
     * @param User $user
     * @return array|mixed
     * @throws Exception
     */
    public function login(User $user, $generateToken = true, $keyAppPartner = null)
    {
        try {
            $this->validator->validateLogin($user);

            $resultSql = $this->service->sqlLogin($user, $keyAppPartner);

            $customer = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
                ->get(false);

            if (!$customer)
                throw new UserException(801, $user->toStdClass());

            $tokens = (new UserDao)
                ->updateTokens($customer->idUser, $user->getDeviceToken(), $generateToken);

            $customer->api_token = $generateToken ? $this->tokenApi->encrypt($tokens['api_token']) : $this->tokenApi->encrypt($customer->api_token);
            $customer->device_token = $tokens['deviceToken'];

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param User $user
     * @return array|mixed
     * @throws InvalidFieldCustomerException
     * @throws Exception
     */
    public function loginSocial(User $user)
    {
        try {
            $this->validator->validateSocialLogin($user);

            $customer = $this->queryLogin($user);

            /**
             * Verifica se temos uma vinculação de conta para fazer
             * (usuário existe pelo email, mas não tem Google ID)
             */
            if (!$customer && $user->getEmail() && $user->getGoogleId()) {
                // Tenta buscar o usuário somente pelo email
                $emailOnlyUser = clone $user;
                $emailOnlyUser->setGoogleId(null);

                $customer = $this->queryLogin($emailOnlyUser);

                // Se encontrou o usuário pelo email, vincula o Google ID
                if ($customer) {
                    $this->linkSocialAccount($customer->idUser, $user);
                    $customer->google_id = $user->getGoogleId();
                    $customer->account_linked = true;
                }
            }

            /**
             * Caso o usuário não exista, ele cria um novo
             */
            if (!$customer)
                $customer = $this->registerBySocial($user->toStdClass());

            $tokens = (new UserDao)
                ->updateTokens($customer->idUser, $user->getDeviceToken());

            $customer->api_token = $this->tokenApi->encrypt($tokens['api_token']);
            $customer->device_token = $tokens['deviceToken'];

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (InvalidFieldCustomerException $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function newSocialLogin()
    {
        try {
            $data = new NewSocialLogin;
            $value = (new NewSocialLoginDao)->sqlInsert($data);

            return $value;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function getSocialLogin($id)
    {
        try {
            return $this->queryGetSocialLogin($id);
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    public function updateSocialLogin($request)
    {
        try {
            return $this->queryUpdateSocialLogin($request);
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function autoLoginByPhone($request)
    {
        try {
            if (!isset($request->deviceToken))
                throw new Exception("Device Token não informado");

            if (!isset($request->phone))
                throw new Exception("Telefone do usuário não foi enviado");

            $user = new User;
            $user->setPhone($request->phone);
            $user->setDeviceToken($request->deviceToken);

            $customer = $this->queryLogin($user);

            if (!$customer)
                throw new Exception("Cliente não encontrado");

            $generateToken = $request->generateToken ?? true;

            $tokens = (new UserDao)
                ->updateTokens($customer->idUser, $user->getDeviceToken(), $generateToken);

            $customer->api_token = $generateToken ? $this->tokenApi->encrypt($tokens['api_token']) : $this->tokenApi->encrypt($customer->api_token);
            $customer->device_token = $tokens['deviceToken'];

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function autoLoginById($request)
    {
        try {
            if (!isset($request->userId))
                throw new Exception("Id do usuário não foi enviado");

            if (!isset($request->deviceToken))
                throw new Exception("Device Token não informado");

            $user = new User;
            $user->setIdUser($request->userId);
            $user->setDeviceToken($request->deviceToken);

            $customer = $this->queryLogin($user);

            $tokens = (new UserDao)
                ->updateTokens($customer->idUser, $user->getDeviceToken());

            $customer->api_token = $this->tokenApi->encrypt($tokens['api_token']);
            $customer->device_token = $tokens['deviceToken'];

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param User $user
     * @return array|mixed
     * @throws Exception
     */
    public function loginPartner(User $user)
    {
        try {
            $this->validator->validateLoginPartner($user);

            $resultSql = $this->service->sqlLoginPartner($user);

            $customer = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
                ->get(false);

            if (!$customer)
                throw new Exception("Usuário ou senha inválida");

            $customer->api_token = $this->updateApiToken($customer->idUser);

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param \app\model\User $user
     * @return array|mixed
     * @throws Exception
     */
    public function socialLoginPartner(User $user)
    {
        try {
            $this->validator->validateSocialLogin($user);

            $customer = $this->queryLoginPartner($user);

            /**
             * Caso o usuário não exista, ele cria um novo
             */
            if (!$customer)
                $customer = $this->registerPartnerBySocial($user->toStdClass());

            $customer->api_token = $this->updateApiToken($customer->idUser);

            $this->createLog(
                $customer,
                $customer->idCustomer,
                $customer->idUser,
                'LOGIN EFETUADO'
            );

            return $customer;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $customerId
     * @param array $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($customerId, $fields = [])
    {
        if (!$customerId)
            throw new CustomerException(702);

        return $this->sqlSelect($fields, [['idCustomer', '=', $customerId]])->get(false);
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    public function findByUser($userId)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();
        $placesTable = (new Place)->getTableName();
        $balanceTable = (new Balance)->getTableName();
        $cityTable = (new City)->getTableName();
        $estateTable = (new Estate)->getTableName();

        $sql = "
            SELECT
              c.idCustomer,
              c.userId,
              c.appVersion,
              c.profileImage,
              u.idUser,
              u.name AS nameUser,
              u.name,
              u.nickname,
              u.email,
              u.phone,
              u.document,
              c.balanceId,
              b.tripBalance,
              b.balance,
              p.idPlace,
              p.alias,
              p.address,
              p.number,
              p.cityId,
              city.nome AS cityName,
              est.sigla AS estate,
              p.latitude,
              p.longitude,
              la.userTypeId
            FROM {$this->table} c
              INNER JOIN {$userTable} u on c.userId = u.idUser
              INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
              LEFT JOIN {$placesTable} p on c.placeId = p.idPlace
              LEFT JOIN {$cityTable} city on p.cityId = city.id
              LEFT JOIN {$estateTable} est on city.estado = est.id
              INNER JOIN {$balanceTable} b on c.balanceId = b.idBalance
            WHERE
                u.idUser = :idUser
        ";

        $customer = $this->sqlRawSelect($sql, [
            ':idUser' => $userId
        ])
            ->first();

        if (!$customer)
            throw new Exception("Cliente não encontrado");

        return $customer;
    }

    /**
     * Encontrar dados para montar o objeto para inserir na viagem
     * quando a corrida for solicitada por um usuario final
     * @param $userId
     * @return array|mixed
     */
    public function findByUserForTrip($userId)
    {
        $userTable = (new User)->getTableName();
        $levelAccess = (new LevelAccess)->getTableName();
        $balanceTable = (new Balance)->getTableName();

        $sql = "
            SELECT
              c.idCustomer,
              c.appVersion,
              u.idUser,
              u.name,
              u.nickname,
              u.email,
              u.gender,
              u.phone,
              u.document,
              u.dateOfBirth,
              u.rg,
              u.rgFrontPicture,
              u.rgBackPicture,
              u.rating,
              u.quantityTrips,
              u.cityId,
              mu.om,
              mf.name AS militaryForce,
              ms.name AS militaryStatus,
              mfg.patent AS militaryPatent,
              c.profileImage,
              la.userTypeId,
              c.customerRegisterStatusId,
              b.tripBalance,
              b.balance,
              u.deviceToken,
              p.idPartner,
              p.nameEstablishment,
              p.addressEstablishment,
              p.function,
              p.partnerRegisterStatusId,
              prs.name AS partnerRegisterStatus,
              isDependent(u.idUser) AS isDependent
            FROM {$this->table} c
              INNER JOIN {$userTable} u on c.userId = u.idUser
              LEFT JOIN {$levelAccess} la on la.userId = u.idUser
              INNER JOIN {$balanceTable} b on c.balanceId = b.idBalance
              LEFT JOIN partner p ON (u.idUser = p.userId AND p.statusId = :statusActive)
              LEFT JOIN partnerRegisterStatus prs ON prs.id = p.partnerRegisterStatusId
              LEFT JOIN militaryUser mu ON mu.userId = u.idUser
              LEFT JOIN militaryForce mf ON mf.id = mu.militaryForceId
              LEFT JOIN militaryStatus ms ON mu.militaryStatusId = ms.id
              LEFT JOIN militaryForceGraduation mfg ON mfg.id = mu.militaryGraduationId
            WHERE
                u.idUser = :idUser
            LIMIT 1
        ";

        $customer = $this->sqlRawSelect($sql, [
            ':idUser' => $userId,
            ':statusActive' => Status::ATIVO
        ])
            ->get(false);

        return $customer;
    }

    /**
     * Encontrar cliente final pelo userId com informações de viagens
     * @return array|mixed
     * @throws Exception
     */
    public function findWithTrip()
    {
        $userId = Headers::getUserId();

        $pictureLink = Config::get('link_storage_pictures');
        $customer = $this->findByUserForTrip($userId);

        $trip = (new TripDao)
            ->findCurrentByUserCustomer($customer->idUser);

        $this->updatePlatformAndVersion($customer->idUser);

        $customer->trip = !empty($trip) ? $trip : null;

        $customer->appVersion = $this->getCustomerAppVersion();
        $customer->referralMonetization = $this->mountReferralMonetization($customer->idUser, $customer->cityId);

        $customer->rgFrontPicture = $customer->rgFrontPicture ?
            $pictureLink . CustomerConst::DOC_IMAGE_DIR . $customer->rgFrontPicture : null;

        $customer->rgBackPicture = $customer->rgBackPicture ?
            $pictureLink . CustomerConst::DOC_IMAGE_DIR . $customer->rgBackPicture : null;

        $customer->docsUser = (new DocUserDao)->findByUser($userId);

        return $customer;
    }

    private function mountReferralMonetization($userId, ?int $cityId = null)
    {
        return (new ReferralMonetizationDao)
            ->findUserLevelWithProgress($userId, $cityId);
    }

    /**
     * @param $customerId
     * @return array|mixed
     * @throws Exception
     */
    public function findWithUser($customerId)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $sql = "
            SELECT
              c.idCustomer,
              u.idUser,
              u.name AS nameUser,
              u.name,
              u.nickname,
              u.email,
              u.phone,
              u.dateOfBirth,
              u.document,
              la.userTypeId
            FROM {$this->table} c
              INNER JOIN {$userTable} u on c.userId = u.idUser
              INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
            WHERE
                c.idCustomer = :customerId
        ";

        $customer = $this->sqlRawSelect($sql, [
            ':customerId' => $customerId
        ])
            ->get(false);

        return $customer;
    }

    /**
     * @param \app\model\Trip $trip
     * @return mixed
     * @throws Exception
     */
    public function sendSmsInDriverArrival(Trip $trip)
    {
        $customer = empty($trip->getCustomerId()) ?
            $this->findByUser($trip->getUserId()) :
            $this->find($trip->getCustomerId());

        $key = $trip->getTripPaymentFormId() == TripPaymentFormConst::MONEY_IN_CAR ?
            'sms_to_customer_in_driver_arrival_money_in_car' : 'sms_to_customer_in_driver_arrival';

        $configMessage = Config::get($key, ConfigType::TRIP);

        return (new CustomerService)
            ->sendSmsInDriverArrival(new Customer($customer), $trip, $configMessage);
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function registerPartner($request)
    {
        try {
            $this->validator->validateInsertCustomer($request->user, false);

            $this->beginTransaction();

            $bankAccount = $this->createBankAccount($request->user->bankAccount ?? null);
            $user = $this->createUser($request, $bankAccount);
            $customer = $this->createByUser($user);
            $place = (new PlaceDao)
                ->attachPlaceIntoCustomerPartner($customer, $request);

            $this->insertDefaultPlace($place, $customer);

            $logData = (object)[
                'user' => $user->toStdClass(),
                'customer' => $customer->toStdClass(),
                'place' => $place->toStdClass()
            ];

            $this->createLog(
                $logData,
                $customer->getIdCustomer(),
                $user->getIdUser(),
                'NOVO CLIENTE PARCEIRO REGISTRADO'
            );

            $this->commit();
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }

        return true;
    }

    /**
     * Registra um cliente final
     * @param $request
     * @param null $FILES
     * @param bool $isDependent
     * @return User
     * @throws Exception
     */
    public function register($request, $FILES = null, $isDependent = false)
    {
        try {
            if (empty($request->nickname) && !empty($request->name)) {
                $parts = explode(' ', trim($request->name));
                $request->nickname = $parts[0];
            }
            $requireDoc = !empty($request->document);
            $this->validator->validateInsertCustomer($request, $requireDoc);

            $this->beginTransaction();

            $user = $this->createUser(
                $request,
                null,
                UserType::CLIENTE_FINAL,
                $FILES
            );

            if (isset($request->militaryUser)) {
                $militaryUser =
                    new MilitaryUser($request->militaryUser);

                $militaryUser
                    ->setUserId($user->getIdUser());

                (new MilitaryUserDao)->sqlInsert($militaryUser);
            }

            $customer = $this->createByUser($user, $FILES, $isDependent);

            if (isset($request->driverId) && is_numeric($request->driverId))
                $this->favoriteDriverService
                    ->insert((object)[
                        'customerId' => $customer->getIdCustomer(),
                        'driverId' => $request->driverId
                    ]);

            if (isset($request->userId) && is_numeric($request->userId)) {
                $this->favoriteDriverService
                    ->insert((object)[
                        'customerId' => $customer->getIdCustomer(),
                        'userId' => $request->userId
                    ]);

                $this->service
                    ->createCustomerIndication($request->userId, $customer->getUserId());
            }

            if ((bool)Config::get('customer_signup_as_partner'))
                $this->createPartner($user->getIdUser());

            $this->saveDocs($request, $user, $FILES);

            $logData = (object)[
                'user' => $user->toStdClass(),
                'customer' => $customer->toStdClass()
            ];

            $this->createLog(
                $logData,
                $customer->getIdCustomer(),
                $user->getIdUser(),
                'NOVO CLIENTE REGISTRADO'
            );

            $this->commit();
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $user;
    }

    private function saveDocs($data, User $user, $photos)
    {
        if (!isset($data->docs))
            return false;

        foreach ($data->docs as $doc) {
            $docUser = new DocUser;
            $docUser
                ->setUserId($user->getIdUser())
                ->setDocId($doc->docId)
                ->setDocStatusId(DocUserConst::IN_ANALYSIS)
                ->setText($doc->text ?? null);

            if (isset($photos["DOC_{$doc->docId}"])) {
                $docUser
                    ->setImage($photos["DOC_{$doc->docId}"]);
            }

            $docUser
                ->setId((new DocUserDao)->sqlInsert($docUser));
        }

        return true;
    }

    private function createPartner($userId)
    {
        $partner = new Partner;
        $partner
            ->setUserId($userId)
            ->setCreatedAt(now())
            ->setPartnerRegisterStatusId(PartnerRegisterStatusConst::ACTIVE)
            ->setIdPartner(
                (new PartnerDao)
                    ->sqlInsert($partner)
            );

        return $partner;
    }

    /**
     * Registra um novo usuario que se conecta por uma rede social
     * O cadastro fica incompleto
     * @param stdClass $request
     * @return array|mixed
     * @throws Exception
     */
    public function registerPartnerBySocial($request)
    {
        try {
            $this->validator->validateInsertCustomerBySocial($request);

            $this->beginTransaction();

            $user = $this->createUser($request);
            $customer = $this->createByUser($user);

            $logData = (object)[
                'user' => $user->toStdClass(),
                'customer' => $customer->toStdClass()
            ];

            $this->createLog(
                $logData,
                $customer->getIdCustomer(),
                $user->getIdUser(),
                'NOVO CLIENTE PARCEIRO REGISTRADO POR LOGIN SOCIAL'
            );

            $this->commit();

            return $this->queryLoginPartner($user);
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * Registra um novo usuario final que se conecta por uma rede social
     * O cadastro fica incompleto
     * @param stdClass $request
     * @return array|mixed
     * @throws Exception
     */
    private function registerBySocial($request)
    {
        try {
            $this->validator->validateInsertCustomerBySocial($request);

            $this->beginTransaction();

            $user = $this->createUserBySocial($request);
            $customer = $this->createByUser($user);

            if (isset($request->driverId))
                $this->favoriteDriverService
                    ->insert((object)[
                        'customerId' => $customer->getIdCustomer(),
                        'driverId' => $request->driverId
                    ]);

            $logData = (object)[
                'user' => $user->toStdClass(),
                'customer' => $customer->toStdClass()
            ];

            $this->createLog(
                $logData,
                $customer->getIdCustomer(),
                $user->getIdUser(),
                'NOVO CLIENTE REGISTRADO POR LOGIN SOCIAL'
            );

            $this->commit();

            return $this->queryLogin($user);
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $data
     * @return stdClass
     * @throws Exception
     */
    public function newTrip($data)
    {
        $tripDao = new TripDao;

        $this->tripValidator->validateNewTrip($data, false);

        $city = $this->cityService->findCityByCoordinate($data->origin->latitude, $data->origin->longitude);
        $this->checkAllowedGender($data->userId, $data->tripTypeId, $city->id);

        try {
            $tripType = (new TripTypeDao)
                ->find($data->tripTypeId);

            $isOpenPriceTrip = (bool)$tripType->openPrice;

            $this->beginTransaction();

            if (isset($data->customer))
                $tripCustomerId = $this->createTripCustomer($data->customer)->getIdCustomer();

            $data->customerId = $tripCustomerId ?? null;

            // Busca motoristas bloqueados pelo cliente e adiciona ao objeto de dados
            $blockedDrivers = $this->getBlockedDriversForUser($data->userId);

            $this->trip = $this->createTrip($data, $isOpenPriceTrip, $origin);

            if (isset($data->waypoints) && !empty($data->waypoints))
                $currentWaypoints = $this->createWayPoints($data->waypoints, $this->trip->getTripReference());

            if (isset($data->deliveryInfo))
                $this->createDeliveryInfo($this->trip->getTripReference(), $data->deliveryInfo);

            if (isset($data->tripItems))
                $this->createTripItems($this->trip->getTripReference(), $data->tripItems);

            if (isset($data->tolls))
                $this->createTollsTrip($this->trip->getIdTrip(), $data->tolls);

            $this->createTripTaxes($this->trip->getIdTrip(), $city->id, $data->tripTypeId, $data->taxes ?? []);

            $this->tripPayment($customer, $isOpenPriceTrip, $data->cardId ?? null, $data->mpToken ?? null, $data->idTransaction ?? null);

            $result = $this->tripCallService
                ->callDrivers($this->trip, $origin);

            $this->minPriceRewardTripService->generate($this->trip);

            /** @var stdClass $trip */
            $trip = $tripDao->find($this->trip->getTripReference());

            $logData = (object)[
                'drivers' => $result['resultDrivers'],
                'customer' => $data->customer ?? $customer,
                'trip' => $trip,
                'customerPartner' => $customer
            ];

            $this->createLog(
                $logData,
                $trip->tripReference,
                $trip->userId,
                "VIAGEM INSERIDA",
                LogCriticalType::AVISO
            );

            $tripParamsMobilityLite = [
                'appName' => env('APP_NAME'),
                'tripReference' => $trip->tripReference,
                'price' => floatval($trip->price),
                'distance' => floatval($data->distance),
                'tripTime' => floatval($data->estimatedTripTime),
                'drivers' => $result['resultDrivers'],

                'origin' => [
                    'latitude' => $data->origin->latitude,
                    'longitude' => $data->origin->longitude,
                    'address' => $data->origin->address,
                ],

                'destination' => [
                    'latitude' => $data->destination->latitude,
                    'longitude' => $data->destination->longitude,
                    'address' => $data->destination->address,
                ],

                'tripWayPoints' => $currentWaypoints ?? [],

                'customer' => [
                    'name' => $trip->customerName,
                    'phone' => $trip->customerPhone
                ]
            ];

            Queue::dispatch(MobilityLiteJob::class, ['trip' => $tripParamsMobilityLite]);

            $trip->timeToExpireTrip = $this->getTimeToExpireTrip(
                $this->trip->getTripReference(),
                $result['resultDrivers']
            );

            $this->commit();


            Queue::dispatch(
                TripWhatsAppNotificationJob::class,
                ['tripReference' => $this->trip->getTripReference()]
            );


            $this->tripRealtime
                ->setBlockedDrivers($blockedDrivers)
                ->hydrate($trip)
                ->createTrip();

            exec(
                "nohup php ../console/command.php trip-call {$this->trip->getTripReference()} > /dev/null 2>&1 & echo $! "
            );


            if (Trip::GET_BID_BY_DRIVERS == $this->trip->getStatus()) {
                exec(
                    "nohup php ../console/command.php notify-drivers-new-bid {$this->trip->getTripReference()} > /dev/null 2>&1 & echo $! "
                );
            }

            if (
                empty($result['resultDrivers']) &&
                !isset($data->schedule) &&
                !$this->trip->getDriverId() &&
                !in_array($this->trip->getStatus(), [Trip::STAND_BY, Trip::SCHEDULED, Trip::GET_BID_BY_DRIVERS])
            ) {
                $this->manageBalanceInCancel($trip);
                $this->cancelTripIfNoDrivers($trip->tripReference, now(), $trip->userId, Trip::NOT_ANSWERED);

                throw new Exception($tripType->messageNoDriversFound);
            }

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

            return $trip;
        } catch (CheckoutCardException $e) {
            $this->updateTripOnPaymentRefused();
            $this->commit();
            (new LogDao)->logException($e);
            Logger::info("[CustomerDao] -> newTrip() CheckoutCardException: " . $e->getMessage());
            throw $e;
        } catch (CheckoutServiceException $e) {
            $this->updateTripOnPaymentRefused();
            $this->commit();
            (new LogDao)->logException($e);
            Logger::info("[CustomerDao] -> newTrip() CheckoutServiceException: " . $e->getMessage());
            throw $e;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            Logger::info("[CustomerDao] -> newTrip() Exception: " . $e->getMessage());
            throw $e;
        }
    }

    private function cancelTripIfNoDrivers($tripReference, $dateEnd, $userId, $status = 'canceled')
    {
        $this->beginTransaction();

        $tripDao = new TripDao;
        $trip = (new TripDao)->find($tripReference);
        $this->validateCancelTrip($trip->status, $status);

        $tripDao->cancelByCustomer($tripReference, $dateEnd, $status, null);
        $this->commit();

        $logData = (object)[
            'push' => [
                'driver' => null,
                'customer' => null
            ],
            'tripReference' => $trip->tripReference,
            'userId' => $userId,
            'data' => $trip
        ];


        $this->createLog(
            $logData,
            $trip->tripReference,
            $userId,
            "NENHUM MOTORISTA ENCONTRADO PARA ESSA VIAGEM.",
            LogCriticalType::AVISO
        );

        (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);

        $this->deleteRealtime($trip->tripReference);

        (new RedisUtil)->delete("trip-{$trip->tripReference}");
    }

    private function createTollsTrip($tripId, $tolls)
    {
        if (is_array($tolls))
            foreach ($tolls as $tollId) {
                $tollTrip = new TollTrip;
                $tollTrip
                    ->setTollId($tollId)
                    ->setTripId($tripId)
                    ->setId((new TollTripDao)->sqlInsert($tollTrip));
            }
    }

    private function createDeliveryInfo($tripReference, $data)
    {
        $deliveryInfo = new DeliveryInfo($data);
        $deliveryInfo
            ->setTripReference($tripReference)
            ->setId(
                (new DeliveryInfoDao)
                    ->sqlInsert($deliveryInfo)
            );

        return $deliveryInfo;
    }

    private function createTripItems($tripReference, array $data)
    {
        foreach ($data as $value) {
            if (empty($value) || empty(get_object_vars($value)))
                continue;

            $item = new TripItem($value);
            $item
                ->setTripReference($tripReference)
                ->setId(
                    (new TripItemDao)
                        ->sqlInsert($item)
                );
        }
    }

    private function createTripTaxes(int $idTrip, int $cityId, int $tripTypeId, array $taxesPaidByCustomerIds = []): bool
    {
        $taxesRemaining = (new TaxDao())->findActivesByCityAndTripType($cityId, $tripTypeId, $taxesPaidByCustomerIds ? ['driver'] : ['driver', 'customer']);

        $taxes = array_merge($taxesPaidByCustomerIds, array_column($taxesRemaining, 'id'));

        $tripTaxes = array_map(function (int $idTax) use ($idTrip) {
            return new TripTax([
                'tripId' => $idTrip,
                'taxId' => $idTax
            ]);
        }, $taxes);

        if (!$tripTaxes) {
            return false;
        }

        return (new TripTaxDao())->sqlInsertMany($tripTaxes);
    }

    /**
     * @param $tripReference
     * @param $dateEnd
     * @param $userId
     * @param string $status
     * @param bool $scheduledTrip
     * @return array|mixed
     * @throws Exception
     */
    public function cancelTrip($tripReference, $dateEnd, $userId, $status = 'canceled', $scheduledTrip = false, $cancellationReasonsId = null)
    {
        try {
            $this->beginTransaction();

            $trip = (new TripDao)->find($tripReference);

            $this->validateCancelTrip($trip->status, $status);

            if ($status != Trip::NOT_ANSWERED)
                $cancelFee = $this->tripCancellationCustomerFeeService
                    ->insert(new Trip($trip), new Driver($trip->driver), new Location($trip->origin));

            $this->manageBalanceInCancel($trip, $cancelFee ?? null);

            $status = !is_null($trip->driverId) ? Trip::CANCELED : $status;
            $this->cancelInTrip($tripReference, $dateEnd, $status, $cancellationReasonsId);

            if ($trip->driverId) (new DriverDao)->putAvailable($trip->driverId);

            $trip = (new TripDao)->find($tripReference);

            $this->commit();

            $logData = (object)[
                'push' => [
                    'driver' => $trip->driver ?
                        $this->notifyDriverOnCancel($trip->driver->deviceToken) : null,
                    'customer' => $status == Trip::NOT_ANSWERED ?
                        $this->service
                        ->notifyOnExpiredTrip($trip->customer->deviceToken ?? null, $scheduledTrip) :
                        null
                ],
                'tripReference' => $trip->tripReference,
                'userId' => $userId,
                'data' => $trip
            ];


            $this->createLog(
                $logData,
                $trip->tripReference,
                $userId,
                $trip->driver != null ? "VIAGEM CANCELADA PELO CLIENTE" : "VIAGEM CANCELADA PELO SISTEMA",
                LogCriticalType::AVISO
            );

            (new IntegrationPartnersServiceDao())->sendTripDataToPartners($trip);


            $this->deleteRealtime($trip->tripReference);

            (new RedisUtil)->delete("trip-{$trip->tripReference}");
            Queue::dispatch(MobilityLiteCancelTripJob::class, ['tripReference' => $trip->tripReference]);
            return $trip;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param string $driverDeviceToken
     * @return array|null
     * @throws PushException
     */
    private function notifyDriverOnCancel(string $driverDeviceToken): ?array
    {
        $push = new Push();
        $push
            ->setTitle(strtoupper(Config::get('app_title') ?? 'CANCELAMENTO DE VIAGEM'))
            ->setBody("A viagem foi cancelada!")
            ->setAction(PushActionConst::OPEN_APP)
            ->setTag(PushTagConst::RIDE_CANCELLED)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->sendNotificationWithData($driverDeviceToken);
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
     * @param $tripStatus
     * @param string $statusSent
     * @throws Exception
     */
    private function validateCancelTrip($tripStatus, $statusSent = 'canceled')
    {
        if ($tripStatus == Trip::NOT_ANSWERED)
            throw new Exception("Viagem não foi atendida");

        if ($tripStatus == Trip::CANCELED)
            throw new Exception("Viagem já cancelada");

        if ($tripStatus == Trip::FINISHED)
            throw new Exception("Viagem já finalizada");

        if ($tripStatus == Trip::IN_PROGRESS)
            throw new Exception("Viagem em andamento, a mesma não pode ser cancelada");

        if (in_array($tripStatus, [Trip::ACCEPTED, Trip::PRE_ACCEPTED]) && $statusSent == Trip::NOT_ANSWERED)
            throw new Exception("Viagem foi atendida, não pode ser marcada como não atendida");

        if (in_array($tripStatus, [Trip::ACCEPTED, Trip::PRE_ACCEPTED]) && $statusSent == Trip::BACK_OFF)
            throw new Exception("Viagem foi atendida, tente novamente");
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    public function getPartnerBalance($userId)
    {
        $customer = $this->findByUser($userId);

        return (new BalanceDao)->find($customer->balanceId);
    }

    /**
     * Enviar código para redefinição de senha
     * @param $email
     * @return mixed
     * @throws Exception
     */
    public function forgotPassword($email)
    {
        $sql =
            /** @lang sql */
            "
            SELECT
                u.idUser,
                u.name,
                u.email,
                u.phone,
                u.cityId,
                u.last_lat,
                u.last_lon
            FROM {$this->table} c
              INNER JOIN user u ON u.idUser = c.userId
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE la.userTypeId = :userTypeId AND
              u.statusId = :statusId AND
              u.email = :email
        ";

        $user = $this->sqlRawSelect($sql, [
            ':userTypeId' => UserType::CLIENTE_FINAL,
            ':statusId' => User::STATUS_ATIVO,
            ':email' => $email
        ])
            ->get(false);

        if (!$user)
            throw new CustomerException(700, $email);

        if (!$user->cityId) {
            if (!is_null($user->last_lat) && !is_null($user->last_lon)) {
                $city = ((new CityDao())->findByCoordinate($user->last_lat, $user->last_lon));
                $user->cityId = $city->id ?? null;
            }
        }

        $userObj = new User;
        $userObj->setEmail($user->email);
        $userObj->setIdUser($user->idUser);

        $customer = $this->sqlSelect(['userId'], [['userId', '=', ':userId']])
            ->bind([':userId' => $userObj->getIdUser()])
            ->get(false);

        if (!$customer)
            throw new CustomerException(701);

        return $this->service->sendRecoveryCode(new User($user));
    }

    public function forgotPasswordPro(object $data, int $type)
    {
        $field1 = $data->field1;
        $field2 = $data->field2;
        $notificationType = $data->notificationType ?? 1;

        switch ($type) {
            case RecoveryPasswordTypeConst::EMAIL;
                $user = $this->getUserByColumn('email', $field1);
                break;
            case RecoveryPasswordTypeConst::DOCUMENT_TELEFONE;
                $user = $this->getUserByColumn('document', $field1, 'phone', $field2);
                break;
            case RecoveryPasswordTypeConst::ANIVERSARIO_TELEFONE;
                $user = $this->getUserByColumn('dateOfBirth', $field1, 'phone', $field2);
                break;
            default:
                $user = $this->getUserByColumn('email', $field1);
                break;
        }

        if (!$user->cityId) {
            if (!is_null($user->last_lat) && !is_null($user->last_lon)) {
                $city = ((new CityDao())->findByCoordinate($user->last_lat, $user->last_lon));
                $user->cityId = $city->id ?? null;
            }
        }

        $userObj = new User;
        $userObj->setEmail($user->email);
        $userObj->setIdUser($user->idUser);

        $customer = $this->sqlSelect(['userId'], [['userId', '=', ':userId']])
            ->bind([':userId' => $userObj->getIdUser()])
            ->get(false);

        if (!$customer)
            throw new CustomerException(701);

        return $this->service->sendRecoveryCodePro(new User($user), $notificationType);
    }

    private function getUserByColumn($column, $value, $column2 = null, $value2 = null)
    {
        if ($column == 'document' || $column == 'phone' || $column == 'dateOfBirth') {
            $value = str_replace(['.', '-', '/', '(', ')', ' '], '', $value);
        }
        if ($column2 == 'document' || $column2 == 'phone' || $column2 == 'dateOfBirth') {
            $value2 = str_replace(['.', '-', '/', '(', ')', ' '], '', $value2);
        }

        $sql =
            /** @lang sql */
            "
            SELECT
                u.idUser,
                u.name,
                u.email,
                u.phone,
                u.cityId,
                u.last_lat,
                u.last_lon
            FROM {$this->table} c
              INNER JOIN user u ON u.idUser = c.userId
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE la.userTypeId = :userTypeId AND
              u.statusId = :statusId AND
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(u.{$column}, '.', ''), '-', ''), '/', ''), '(', ''), ')', ''), ' ', '') = :value
            ";
        // Usando esse replace, pois o REGEXP_REPLACE não esta disponivel nesse mysql
        if (!is_null($column2)) {
            $sql .= " AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(u.{$column2}, '.', ''), '-', ''), '/', ''), '(', ''), ')', ''), ' ', '') = {$value2}";
        }

        $user = $this->sqlRawSelect($sql, [
            ':userTypeId' => UserType::CLIENTE_FINAL,
            ':statusId' => User::STATUS_ATIVO,
            ':value' => $value,
        ])
            ->get(false);
        if (!$user)
            throw new CustomerException(701, [
                'value1' => $value,
                'value2' => $value2,
            ]);
        return $user;
    }

    /**
     * @param $email
     * @param $password
     * @return bool
     * @throws CustomerException
     * @throws Exception
     */
    public function changePassword($email, $password, $withoutCode = false, $isPro, $code)
    {
        $this->validator->validateChangePassword($password);

        $sql =
            /** @lang sql */
            "
            SELECT
                u.idUser,
                u.name,
                u.email,
                u.phone
            FROM {$this->table} c
              INNER JOIN user u ON u.idUser = c.userId
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE la.userTypeId = :userTypeId AND
              u.statusId = :statusId AND
              u.email = :email
        ";

        $user = $this->sqlRawSelect($sql, [
            ':userTypeId' => UserType::CLIENTE_FINAL,
            ':statusId' => User::STATUS_ATIVO,
            ':email' => $email
        ])
            ->get(false);

        if (!$user)
            throw new CustomerException(700, $email);

        $user = new User($user);

        if (!$withoutCode) {
            $lastValidConfirmationCode = (new UserConfirmationCodeDao)->findLastValidConfirmationCode($user->getIdUser());

            if ($isPro && $lastValidConfirmationCode->code != $code) {
                throw new CustomerException(708);
            }

            if (!$lastValidConfirmationCode) {
                throw new CustomerException(707, $email);
            }

            (new UserConfirmationCodeDao)->markUsed($lastValidConfirmationCode->id);
        }

        $user->setPassword($password);

        $this->beginTransaction();

        try {
            $result = (new UserDao)->sqlUpdate(
                ['password' => ':password'],
                [['idUser', '=', ':idUser']],
                [
                    ':password' => $user->getPassword(),
                    ':idUser' => $user->getIdUser()
                ]
            );

            $this->commit();
        } catch (Exception $e) {
            $this->rollBack();
            throw $e;
        }

        return $result;
    }

    public function getTrips($request)
    {
        $resultWhere = $this->service->getWhereForGetTrips($request);

        $count = $this->sqlRawSelect("
                SELECT COUNT(*) AS totalRows FROM trip t
                  INNER JOIN customer c ON c.userId = t.userId
                WHERE {$this->service->getWhereLikeString($resultWhere['where'])}
            ", $resultWhere['bind'])
            ->get(false);

        $resultSql = $this->service->getSqlForGetTrips($count->totalRows, $resultWhere['where'], $request->page ?? null);

        $trips = $this->sqlRawSelect($resultSql['sql'], $resultWhere['bind'])->get();

        return [
            "paginate" => $resultSql['paginationInfo'],
            "trips" => array_map(function ($trip) {
                $trip->tripWayPoints = $this->tripWayPointService
                    ->findByTrip($trip->tripReference);

                $trip->schedule = (new TripScheduledDao)
                    ->findByTrip($trip->tripReference);

                return $trip;
            }, $trips)
        ];
    }

    /**
     * @param $customerId
     * @param $photo
     * @return string
     * @throws Exception
     */
    public function updateProfileImage($customerId, $photo)
    {
        if (!$photo)
            throw new CustomerException(705, compact($photo));

        $customer = $this->find($customerId);

        if (!$customer)
            throw new CustomerException(701, ['customerId' => $customerId]);

        $photoName = $this->service->updateProfileImage($customer->profileImage, $photo);

        $this->sqlUpdate(
            ['profileImage' => ':profileImage'],
            [['idCustomer', '=', ':idCustomer']],
            [':profileImage' => $photoName, ':idCustomer' => $customerId]
        );

        $customer->profileImage = $photoName;

        $log = new Log(LogType::PROCESS);
        $log->setData($customer)
            ->setIdReference($customer->idCustomer)
            ->setUserId($customer->userId)
            ->setApp(LogApp::CUSTOMER)
            ->setMessage("CLIENTE ALTEROU SUA FOTO DE PERFIL");

        (new LogDao)->insert($log);

        return $photoName;
    }

    /**
     * @param $customerId
     * @param $customerRegisterStatusId
     * @return bool
     * @throws Exception
     */
    public function updateCustomerStatus($customerId, $customerRegisterStatusId)
    {
        return $this->sqlUpdate(
            ['customerRegisterStatusId' => ':customerRegisterStatusId'],
            [['idCustomer', '=', ':idCustomer']],
            [':customerRegisterStatusId' => $customerRegisterStatusId, ':idCustomer' => $customerId]
        );
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function editProfile($request)
    {
        try {
            $this->beginTransaction();

            $request->idUser = Headers::getUserId();

            $userDao = new UserDao;

            $user = $userDao->find($request->idUser);

            if (!$user)
                throw new UserException(800, ['passedIdUser' => $request->idUser]);

            $setMilitary = [];
            $bindMilitary = [];
            if (isset($request->militaryForceId)) {
                $setMilitary['militaryForceId'] = ':militaryForceId';
                $bindMilitary[':militaryForceId'] = $request->militaryForceId;
                unset($request->militaryForceId);
            }
            if (isset($request->militaryGraduationId)) {
                $setMilitary['militaryGraduationId'] = ':militaryGraduationId';
                $bindMilitary[':militaryGraduationId'] = $request->militaryGraduationId;
                unset($request->militaryGraduationId);
            }
            if (isset($request->militaryStatusId)) {
                $setMilitary['militaryStatusId'] = ':militaryStatusId';
                $bindMilitary[':militaryStatusId'] = $request->militaryStatusId;
                unset($request->militaryStatusId);
            }
            if (isset($request->om)) {
                $setMilitary['om'] = ':om';
                $bindMilitary[':om'] = $request->om;
                unset($request->om);
            }

            if (!empty($setMilitary)) {
                $militaryUserDao = new MilitaryUserDao();

                $militaryUser = $militaryUserDao->sqlSelect([], [['userId', '=', $request->idUser]])->first();

                if (empty($militaryUser)) {
                    $militaryUser = new MilitaryUser();
                    $militaryUser->setMilitaryForceId($bindMilitary[':militaryForceId'] ?? null);
                    $militaryUser->setMilitaryStatusId($bindMilitary[':militaryStatusId'] ?? null);
                    $militaryUser->setMilitaryGraduationId($bindMilitary[':militaryGraduationId'] ?? null);
                    $militaryUser->setOm($bindMilitary[':om'] ?? null);
                    $militaryUser->setUserId($request->idUser);
                    $militaryUserDao->sqlInsert($militaryUser);
                } else {
                    $bindMilitary[':userId'] = $request->idUser;
                    $militaryUserDao->sqlUpdate($setMilitary, [['userId', '=', ':userId']], $bindMilitary);
                }

                if (count(get_object_vars($request)) == 1) {
                    $this->commit();
                    return $userDao->find($request->idUser);
                }
            }

            $this->validateEditProfile($user, $request);

            unset($request->zafiraValidated);

            if ((isset($request->name) && $user->name !== $request->name) || (isset($request->document) && $user->document !== $request->document)) {
                $request->isValidDocument = null;
            }

            $originalName = trim($user->name ?? '');
            $originalPhone = trim($user->phone ?? '');
            $originalDocument = trim($user->document ?? '');
            $originalEmail = trim($user->email ?? '');

            $newName = isset($request->name) ? trim($request->name) : $originalName;
            $newPhone = isset($request->phone) ? trim($request->phone) : $originalPhone;
            $newDocument = isset($request->document) ? trim($request->document) : $originalDocument;
            $newEmail = isset($request->email) ? trim($request->email) : $originalEmail;

            $cleanOriginalPhone = preg_replace('/\D/', '', $originalPhone);
            $cleanNewPhone = preg_replace('/\D/', '', $newPhone);
            $cleanOriginalDocument = preg_replace('/\D/', '', $originalDocument);
            $cleanNewDocument = preg_replace('/\D/', '', $newDocument);

            $hasZafiraFieldsChanged =
                $originalName !== $newName
                || $cleanOriginalPhone !== $cleanNewPhone
                || $cleanOriginalDocument !== $cleanNewDocument
                || strtolower($originalEmail) !== strtolower($newEmail);

            if ($hasZafiraFieldsChanged) {
                $request->zafiraValidated = 0;
            }

            $editMounted = $this->service->mountEditProfile($request);

            $userDao->sqlUpdate($editMounted['set'], [$editMounted['where']], $editMounted['bind']);

            $partner = $this->findByUser($request->idUser);
            $this->createLog(
                $partner,
                $partner->idCustomer,
                $partner->idUser,
                'CLIENTE FINAL ALTEROU SUAS INFORMAÇÕES'
            );
            $this->commit();

            $user = $userDao->find($request->idUser);
            $user->api_token = $this->tokenApi->encrypt($user->api_token);

            $this->checkAutoApprovalAfterDataUpdate($request->idUser);

            return $user;
        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $user
     * @param $request
     * @throws CustomerException
     * @throws InvalidFieldCustomerException
     */
    private function validateEditProfile($user, $request)
    {
        if (isset($request->email))
            $this->emailIsValid($request->email, $user->email);

        if (isset($request->phone))
            $this->checkPhoneExists(
                $request->phone,
                UserType::CLIENTE_FINAL_PARCEIRO,
                $user->phone
            );

        if (isset($request->document))
            $this->checkDocumentExists(
                $request->document,
                $user->document,
                UserType::CLIENTE_FINAL_PARCEIRO
            );

        if (isset($request->dateOfBirth))
            $this->validDateOfBirthFormat($request->dateOfBirth);
    }

    /**
     * @param $dateOfBirth
     * @throws CustomerException
     */
    private function validDateOfBirthFormat($dateOfBirth)
    {
        $parsed = DateTime::createFromFormat('Y-m-d', $dateOfBirth);

        if (!$parsed || $parsed->format('Y-m-d') !== $dateOfBirth)
            throw new CustomerException(709, ['sended' => $dateOfBirth]);
    }

    /**
     * @param $email
     * @param null|string $ignore
     * @throws CustomerException
     */
    private function emailIsValid($email, ?string $ignore = null)
    {
        $sql = "
            SELECT
                u.email
            FROM user u
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE
              u.email = :email AND
              u.statusId = :statusId AND
              la.userTypeId = :userTypeId
        ";

        $bind = [
            ':email' => $email,
            ':statusId' => User::STATUS_ATIVO,
            ':userTypeId' => UserType::CLIENTE_FINAL,
        ];

        if ($ignore) {
            $sql .= " AND u.email NOT LIKE :ignore";
            $bind[':ignore'] = $ignore;
        }

        $user = $this->sqlRawSelect($sql, $bind)
            ->get(false);

        if ($user)
            throw new CustomerException(706);
    }

    /**
     * @param $email
     * @return array|mixed
     * @throws Exception
     */
    public function checkEmail($email)
    {
        $userTable = (new User)->getTableName();
        $levelAccess = (new LevelAccess)->getTableName();

        try {
            $sql = "
                SELECT
                    u.email
                FROM {$userTable} u
                  INNER JOIN {$levelAccess} la ON la.userId = u.idUser
                WHERE
                  u.email = :email AND
                  u.statusId = :statusId AND
                  la.userTypeId = :userTypeId
            ";

            $user = $this->sqlRawSelect($sql, [
                ':email' => $email,
                ':statusId' => User::STATUS_ATIVO,
                ':userTypeId' => UserType::CLIENTE_FINAL,
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

    /**
     * @param $phone
     * @param int $userTypeId
     * @return array
     * @throws InvalidFieldCustomerException
     */
    public function checkPhoneAvailableForRegister($phone, $userTypeIds = null)
    {
        if (empty($phone) || strlen((string) $phone) < 5) {
            throw new InvalidFieldCustomerException("Número de telefone não enviado", 'phone');
        }

        $duplicateCheck = new UserDuplicateCheckService;
        $scopedUserTypeIds = $this->resolveCustomerRegisterUserTypeIds($userTypeIds);

        if ($duplicateCheck->phoneExistsForUserTypes($phone, $scopedUserTypeIds)) {
            throw new InvalidFieldCustomerException("Telefone do cliente já existe", 'phone');
        }

        return ['phone' => FormatValue::formatPhoneClear((string) $phone)];
    }

    /**
     * @param int|int[]|null $userTypeIds
     * @return int[]
     */
    private function resolveCustomerRegisterUserTypeIds($userTypeIds): array
    {
        if (is_array($userTypeIds) && !empty($userTypeIds)) {
            return array_map('intval', $userTypeIds);
        }

        if (is_numeric($userTypeIds)) {
            return [(int) $userTypeIds];
        }

        return (new UserDuplicateCheckService)->getCustomerRegisterUserTypeIds();
    }

    /**
     * @param $document
     * @return array|mixed
     * @throws CustomerException
     */
    public function checkDocument($document)
    {
        $checkDocumentService = new CheckDocumentService;

        $resultSql = $checkDocumentService->sqlCheckDocument($document, UserType::CLIENTE_FINAL);

        $customer = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if (!$customer)
            throw new CustomerException(703);

        return $customer;
    }

    /**
     * @param $password
     * @return bool
     * @throws CustomerException
     */
    public function checkPassword($password): bool
    {
        $userid = getallheaders()['Userid'] ?? getallheaders()['userid'];
        $user = new User;
        $user
            ->setIdUser($userid)
            ->setPassword($password);

        $sql = "
            SELECT
                u.idUser,
                u.email
            FROM {$this->table} c
              INNER JOIN user u ON u.idUser = c.userId
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE
              u.idUser = :userId AND
              u.password = :password AND
              u.statusId = :statusId AND
              la.userTypeId = :customerType
        ";

        $bind = [
            ':userId' => $user->getIdUser(),
            ':password' => $user->getPassword(),
            ':statusId' => Status::ATIVO,
            ':customerType' => UserType::CLIENTE_FINAL
        ];

        $customer = $this->sqlRawSelect($sql, $bind)
            ->get(false);

        if (!$customer)
            throw new CustomerException(701);

        return true;
    }

    /**
     * @param $request
     * @param BankAccount $bankAccount
     * @param int $userTypeId
     * @param null $FILES
     * @return User
     * @throws InvalidFieldCustomerException
     * @throws Exception
     */
    private function createUser(
        $request,
        BankAccount $bankAccount = null,
        $userTypeId = UserType::CLIENTE_FINAL_PARCEIRO,
        $FILES = null
    ): User {
        $user = new User($request->user ?? $request);

        $this->checkEmailExists($user->getEmail(), $userTypeId);
        $this->checkPhoneExists($user->getPhone(), $userTypeId);
        if ($user->getDocument())
            $this->checkDocumentExists($user->getDocument(), null, $userTypeId);

        if (!$user->getFacebookId())
            $this->checkFacebookIdExists($user->getFacebookId(), $userTypeId);

        if (isset($FILES['RG_FRONT']))
            $user->setRgFrontPicture($FILES['RG_FRONT'], CustomerConst::DOC_IMAGE_DIR);

        if (isset($FILES['RG_BACK']))
            $user->setRgBackPicture($FILES['RG_BACK'], CustomerConst::DOC_IMAGE_DIR);

        if (!empty($bankAccount)) {
            $user->setBankAccountId($bankAccount->getIdBankAccount());
        }

        if (!empty($request->appPartner)) {
            $user->setAppPartnerKey($request->appPartner);
        }

        if (isset($request->registered_in)) $user->setRegisteredIn($request->registered_in);

        $user->setIdUser(
            (new UserDao)->sqlInsert($user)
        );

        $this->feedLevelAccess($user, $userTypeId);

        return $user;
    }

    /**
     * @param $request
     * @return User
     * @throws Exception
     */
    private function createUserBySocial($request): User
    {
        $userTypeId = UserType::CLIENTE_FINAL;

        $user = new User($request->user ?? $request);

        $this->checkEmailExists($user->getEmail(), $userTypeId);

        try {
            $this->checkPhoneExists($user->getPhone(), $userTypeId);
        } catch (InvalidFieldCustomerException $e) {
            $user->setPhone(null);
        }

        try {
            $this->checkDocumentExists($user->getDocument());
        } catch (InvalidFieldCustomerException $e) {
            $user->setDocument(null);
        }

        if ($user->getFacebookId()) {
            $this->checkFacebookIdExists($user->getFacebookId(), $userTypeId);
        }

        if ($user->getGoogleId()) {
            // Verificar se o Google ID já existe
            $this->checkGoogleIdExists($user->getGoogleId(), $userTypeId);
        }

        $user->setIdUser(
            (new UserDao)->sqlInsert($user)
        );

        $this->feedLevelAccess($user, $userTypeId);

        return $user;
    }

    /**
     * @param $data
     * @return BankAccount|null
     * @throws InvalidFieldBankAccountException
     * @throws Exception
     */
    private function createBankAccount($data): ?BankAccount
    {
        if (!$data)
            return null;

        (new BankAccountValidator)->validateBankAccount($data);

        /** @var BankAccount $bankAccount */
        $bankAccount = (new BankAccountDao)->create($data);

        return $bankAccount;
    }

    /**
     * @param User $user
     * @param int $userTypeId
     * @throws Exception
     */
    private function feedLevelAccess(User $user, $userTypeId = UserType::CLIENTE_FINAL_PARCEIRO): void
    {
        (new LevelAccessDao)
            ->createNew($user->getIdUser(), $userTypeId);
    }

    /**
     * @param User $user
     * @param null $FILES
     * @param bool $isDependent
     * @return Customer
     * @throws Exception
     */
    private function createByUser(User $user, $FILES = null, bool $isDependent = false): Customer
    {
        /** @var Balance $balance */
        $balance = (new BalanceDao)
            ->create();

        $photoName = CustomerConst::DEFAULT_IMAGE_NAME;

        if (isset($FILES['photo']))
            $photoName = $this->service
                ->updateProfileImage($photoName, $FILES['photo']);

        $customer = new Customer;
        $customer
            ->setUserId($user->getIdUser())
            ->setBalanceId($balance->getIdBalance())
            ->setProfileImage($photoName);

        $customerRegisterUnblocked =
            (bool)Config::get('customer_register_unblocked');

        if (!$customerRegisterUnblocked) {
            $customer
                ->setCustomerRegisterStatusId(CustomerRegisterStatusConst::PENDING);

            (new PendencyFieldService)
                ->createByCustomerRegister($customer->getUserId());
        } else {
            $customer
                ->setCustomerRegisterStatusId(CustomerRegisterStatusConst::ATIVO);
        }

        if ($isDependent) {
            $dependentRegisterUnblocked = (bool)Config::get('dependent_register_unblocked');

            $customer
                ->setCustomerRegisterStatusId(
                    $dependentRegisterUnblocked ?
                        CustomerRegisterStatusConst::ATIVO : CustomerRegisterStatusConst::PENDING
                );
        }

        $customer
            ->setIdCustomer(
                $this->sqlInsert($customer)
            );

        return $customer;
    }

    /**
     * @param $email
     * @param $userType
     * @throws Exception
     * @throws InvalidFieldCustomerException
     */
    private function checkEmailExists($email, $userType = UserType::CLIENTE_FINAL_PARCEIRO)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $sql = "
            SELECT
                u.email
            FROM {$userTable} u
              INNER JOIN {$levelAccessTable} la ON u.idUser = la.userId
            WHERE
              u.email = :email AND
              u.statusId = :statusId AND
              la.userTypeId = :userTypeId
        ";

        $userExists = $this->sqlRawSelect($sql, [
            ':email' => $email,
            ':statusId' => User::STATUS_ATIVO,
            ':userTypeId' => $userType
        ])
            ->get(false);

        if ($userExists)
            throw new InvalidFieldCustomerException("Email do cliente já existe", 'email');
    }

    /**
     * @param $phone
     * @param int $userType
     * @param null|string $ignore
     * @throws InvalidFieldCustomerException
     */
    private function checkPhoneExists(
        $phone,
        $userType = UserType::CLIENTE_FINAL_PARCEIRO,
        ?string $ignore = null
    ) {
        $duplicateCheck = new UserDuplicateCheckService;

        if ($duplicateCheck->phoneExistsForUserTypes($phone, [$userType], $ignore)) {
            throw new InvalidFieldCustomerException("Telefone do cliente já existe", 'phone');
        }
    }

    /**
     * @param $document
     * @param null|string $ignore
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function checkDocumentExists(
        $document,
        ?string $ignore = null,
        $userTypeId = UserType::CLIENTE_FINAL
    ) {
        $duplicateCheck = new UserDuplicateCheckService;

        if ($duplicateCheck->documentExistsForUserTypes($document, [$userTypeId], $ignore)) {
            throw new InvalidFieldCustomerException("CPF já existe", 'document');
        }

        return true;
    }

    public function findIncompleteCustomerRegisters()
    {
        $sql = "
            SELECT
                u.idUser,
                u.created_at,
                u.name,
                u.email,
                u.document,
                u.phone,
                c.profileImage,
                u.deviceToken
            FROM user u
                INNER JOIN customer c on u.idUser = c.userId
            WHERE
                  u.deviceToken IS NOT NULL and
                  u.statusId = 1 AND
                  (
                      u.document IS NULL OR
                      u.phone IS NULL OR
                      c.profileImage = 'user.png');
        ";

        return $this->sqlRawSelect($sql)
            ->get();
    }

    public function findByUserForPromotion($userId)
    {
        return $this->sqlSelect(['balanceId'], [['userId', '=', $userId]])->get(false);
    }

    /**
     * @param $facebook_id
     * @param int $userType
     * @throws InvalidFieldCustomerException
     */
    private function checkFacebookIdExists($facebook_id, $userType = UserType::CLIENTE_FINAL_PARCEIRO)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $sql = "
            SELECT
                u.facebook_id
            FROM {$userTable} u
              INNER JOIN {$levelAccessTable} la ON u.idUser = la.userId
            WHERE
              u.facebook_id = :facebook_id AND
              u.statusId = :statusId AND
              la.userTypeId = :userTypeId
        ";

        $userExists = $this->sqlRawSelect($sql, [
            ':facebook_id' => $facebook_id,
            ':statusId' => User::STATUS_ATIVO,
            ':userTypeId' => $userType
        ])
            ->get(false);

        if ($userExists)
            throw new InvalidFieldCustomerException("Facebook já cadastrado em outro usuário", 'facebook_id');
    }

    /**
     * Verifica se o Google ID já existe
     * @param string $google_id ID do Google
     * @param int $userType Tipo de usuário
     * @throws InvalidFieldCustomerException
     */
    private function checkGoogleIdExists($google_id, $userType = UserType::CLIENTE_FINAL_PARCEIRO)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $sql = "
            SELECT
                u.google_id
            FROM {$userTable} u
              INNER JOIN {$levelAccessTable} la ON u.idUser = la.userId
            WHERE
              u.google_id = :google_id AND
              u.statusId = :statusId AND
              la.userTypeId = :userTypeId
        ";

        $userExists = $this->sqlRawSelect($sql, [
            ':google_id' => $google_id,
            ':statusId' => User::STATUS_ATIVO,
            ':userTypeId' => $userType
        ])
            ->get(false);

        if ($userExists)
            throw new InvalidFieldCustomerException("Google ID já cadastrado em outro usuário", 'google_id');
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
    private function createLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        return true;
        try {
            $log = new Log(LogType::PROCESS, $level);
            $log->setData($data)
                ->setIdReference($idReference)
                ->setUserId($userId)
                ->setApp(LogApp::PWA)
                ->setMessage($message);

            return (new LogDao)->insert($log);
        } catch (Exception $e) {
            error_log("Erro ao criar log: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param \app\model\Place $place
     * @param \app\model\\app\model\Customer $customer
     * @return bool
     * @throws Exception
     */
    private function insertDefaultPlace(Place $place, Customer $customer): bool
    {
        return $this->sqlUpdate(
            ['placeId' => ':placeId'],
            [['idCustomer', '=', ':idCustomer']],
            [
                ':placeId' => $place->getIdPlace(),
                ':idCustomer' => $customer->getIdCustomer()
            ]
        );
    }

    /**
     * @param $data
     * @param bool $isOpenPriceTrip
     * @param \app\model\Origin $origin
     * @return \app\model\Trip
     * @throws DiscountCouponException
     * @throws DriverCommissionException
     * @throws TripException
     */
    private function createTrip($data, bool $isOpenPriceTrip = false, ?Origin &$origin = null): Trip
    {
        /** @var TripDao $tripDao */
        $this->verifyCustomerInTrip($data, $tripDao);

        $origin = $this->createOrigin($data);

        $data->destinationId =
            $isOpenPriceTrip ?
            $this->createDestination($origin->toStdClass(), true)->getIdDestination() :
            $this->createDestination($data)->getIdDestination();

        $data->originId = $origin->getIdOrigin();
        $data->cityId = $origin->getCityId();

        $data->driverCommissionId = $this->driverCommissionService
            ->findCommissionId($data->cityId, $data->tripTypeId, $origin);

        $data->status = $this->getTripStatus($data);

        if (isset($data->ticketTrip) && $data->ticketTrip == true) {
            $data->status = isset($data->driverId) ? Trip::ACCEPTED : Trip::STAND_BY;
            $data->tripCallTypeId = TripCallTypeConst::TICKET;
        }

        if ($isOpenPriceTrip)
            $data->tripCallTypeId = TripCallTypeConst::TAXIMETER;

        if (!empty($data->favorites))
            $this->mountFavorites($data);

        $this->mountZone($data, $origin);
        $data->date = now();
        $data->isCalling = true;
        $data->isOffer = 0;

        if ($data->status == Trip::GET_BID_BY_DRIVERS) {
            $data->isOffer = 1;
        }

        if (!$isOpenPriceTrip)
            $priceRange = (new PriceRangeDao)
                ->findNewPriceByCityAndTripType(
                    $data->cityId,
                    $data->tripTypeId,
                    $data->price
                );


        $data->priceRangeId = $priceRange->id ?? null;

        if (isset($data->driverId)) {
            $driver = (new DriverDao)->find($data->driverId);
            $this->verifyDriverForTicketTrip(new Driver($driver));

            $data->driverId = $driver->idDriver;
            (new DriverDao)->putInTripAndRemoveCustomerRefused($data->driverId);
        }

        /** @var \app\model\Trip $trip */
        $trip = $tripDao->create($data);

        if (isset($data->isTurbined) && $data->isTurbined) {
            $this->chargedDao->createTurbocharged($trip);
        }

        $trip->setTripReference($tripDao->sqlSelect(['tripReference'], [['idTrip', '=', $trip->getIdTrip()]])
            ->get(false)->tripReference);

        $this->validTime($data->schedule ?? now(), $data->scheduleISO ?? null, $trip->getUserId());

        if (isset($data->tripDiscountCoupon))
            $this->manageDiscountCoupon($data->tripDiscountCoupon, $trip);

        if (isset($data->cashback->id) && isset($data->cashback->cashbackValue))
            $this->generateTripCashback($data->cashback->id, $data->cashback->cashbackValue, $trip);

        if ($trip->getStatus() == Trip::SCHEDULED || (isset($data->schedule) && !empty($data->schedule)))
            $this->scheduleTrip($trip->getTripReference(), $data->schedule, $data->scheduleISO ?? null);

        return $trip;
    }

    private function getTripStatus($request)
    {
        if (isset($request->isOffer) && $request->isOffer) {
            return Trip::GET_BID_BY_DRIVERS;
        }

        if (isset($request->schedule) && !empty($request->schedule)) {
            return Trip::SCHEDULED;
        }

        return Trip::SEARCHING;
    }

    /**
     * @param \app\model\\app\model\Driver $driver
     * @throws Exception
     */
    private function verifyDriverForTicketTrip(Driver $driver)
    {
        if (
            $driver->getStatus() == Driver::OFF ||
            (!(bool)$driver->getPreAvailable() && $driver->getStatus() == Driver::IN_TRIP)
        )
            throw new DriverException(511, $driver->toStdClass());

        if ($driver->getDriverRegisterStatusId() != DriverRegisterStatus::ATIVO)
            throw new DriverException(512, $driver->toStdClass());
    }

    private function generateTripCashback($cashbackId, $cashbackValue, Trip $trip)
    {
        if ((new CashbackDao)->findActive($cashbackId)) {
            $tripCashback = new TripCashback;
            $tripCashback
                ->setTripReference($trip->getTripReference())
                ->setUserId($trip->getUserId())
                ->setCashbackId($cashbackId)
                ->setValue($cashbackValue)
                ->setId(
                    (new TripCashbackDao)
                        ->sqlInsert($tripCashback)
                );
        }
    }

    /**
     * @param $tripDiscountCoupon
     * @param \app\model\Trip $trip
     * @throws DiscountCouponException
     */
    private function manageDiscountCoupon($tripDiscountCoupon, Trip $trip)
    {
        if (isset($tripDiscountCoupon->userDiscountCouponId) && isset($tripDiscountCoupon->oldPrice)) (new CustomerDiscountCouponService)
            ->useCoupon(
                $tripDiscountCoupon->userDiscountCouponId,
                $tripDiscountCoupon->oldPrice,
                $trip
            );
    }

    /**
     * @param $tripReference
     * @param $schedule
     * @param null $scheduleISO
     * @return \app\model\TripScheduled
     * @throws Exception
     */
    private function scheduleTrip($tripReference, $schedule, $scheduleISO = null)
    {
        $nowUTC = gmdate('Y-m-d H:i:s', strtotime(now())) . ".000Z";

        if ($scheduleISO) {
            if (dateIsBefore($scheduleISO, $nowUTC))
                throw new ScheduleDateException(ScheduleDateException::PAST_DATE);
        } else {
            if (dateIsBefore($schedule, now()))
                throw new ScheduleDateException(ScheduleDateException::PAST_DATE);
        }

        $tripScheduled = new TripScheduled;
        $tripScheduled
            ->setTripReference($tripReference)
            ->setSchedule($schedule)
            ->setScheduleUTC($scheduleISO ? gmdate('Y-m-d H:i:s', strtotime($scheduleISO)) : null)
            ->setId(
                (new TripScheduledDao)->sqlInsert($tripScheduled)
            );

        return $tripScheduled;
    }

    /**
     * @param $time
     * @param $timeUTC
     * @param $userId
     * @throws Exception
     */
    private function validTime($time, $timeUTC, $userId)
    {
        $tripScheduledDao = new TripScheduledDao;

        if ($timeUTC) {
            $trips = $tripScheduledDao
                ->findUpcomingTripsScheduledUTC($timeUTC, $userId);

            if (!empty($trips))
                throw new ScheduleDateException(ScheduleDateException::NEAR_TRIP);
        } else {
            $trips = $tripScheduledDao
                ->findUpcomingTripsScheduled($time, $userId);

            if (!empty($trips))
                throw new ScheduleDateException(ScheduleDateException::NEAR_TRIP);
        }
    }

    /**
     * @param int $userId
     * @param int $tripTypeId
     * @param int $cityId
     * @throws Exception
     */
    private function checkAllowedGender(int $userId, int $tripTypeId, int $cityId)
    {
        $user = new User($this->userDao->find($userId));

        if ((new CityConfigDao())->getByCity($cityId)->enableValidationDocumentInTrip) {
            if (!$user->getIsValidDocument()) {
                $user = (new UserService())->validateNameAndSetGender($user, $cityId);
            }
        }

        $tripType = $this->tripTypeDao
            ->find($tripTypeId);

        if (isset($tripType->gender_id) && $tripType->gender_id != GenderConst::ALL_ID) {
            $genders = [
                GenderConst::MALE_ID => GenderConst::DB_MALE,
                GenderConst::FEMALE_ID => GenderConst::DB_FEMALE
            ];

            if ($tripType->gender_id == GenderConst::FEMALE_ID && $user->getGender() == GenderConst::DB_MALE) {
                throw new Exception("Seu gênero não é permitido");
            }
        }
    }

    private function mountZone(&$data, ?Origin $origin = null)
    {
        $zone = (new ZoneDao)
            ->findFromOrigin($origin);

        //        $zone =
        //            $zone ?? (new ZoneDao)
        //                        ->findFromOrigin($origin);

        $data->zoneId = !empty($zone) ?
            $zone->idZone : null;
    }

    private function mountFavorites(&$data)
    {
        $data->favoriteDrivers = implode(',', (array)$data->favorites);
    }

    private function createWayPoints($wayPoints, $tripReference): array
    {
        $tripWayPoints = $this->tripWayPointService
            ->insertMany($wayPoints, $tripReference);

        return $tripWayPoints;
    }

    /**
     * @param $data
     * @param bool $isOpenPrice
     * @return Destination
     */
    private function createDestination($data, $isOpenPrice = false): Destination
    {
        if ($isOpenPrice) {
            unset($data->idOrigin);
            unset($data->created_at);

            /** @var Destination $destination */
            $destination = (new DestinationDao)
                ->create($data);

            return $destination;
        }

        $data->destination->cityId =
            (!isset($data->destination->cityId) || empty($data->destination->cityId))
            ? null : $data->destination->cityId;

        /** @var Destination $destination */
        $destination = (new DestinationDao)
            ->create($data->destination);

        (new AddressService)->saveAddressIfNotExists($data->destination);

        return $destination;
    }

    /**
     * @param $data
     * @return \app\model\Origin
     * @throws Exception
     */
    private function createOrigin($data): Origin
    {
        if (isset($data->origin)) {
            /** @var \app\model\Origin $origin */
            $origin = (new OriginDao)
                ->create($data->origin);

            (new AddressService)->saveAddressIfNotExists($data->origin);

            $city = $this->cityService
                ->findCityByCoordinate(
                    $origin->getLatitude(),
                    $origin->getLongitude()
                );

            if (isset($city->id))
                $origin
                    ->setCityId($city->id);

            return $origin;
        }

        $customer = $this->findByUser($data->userId);

        $origin = new Origin;
        $origin
            ->setLatitude($customer->latitude)
            ->setLongitude($customer->longitude)
            ->setAddress(
                $customer->address . ', ' .
                    $customer->number . ' - ' . $customer->cityName . ' ' . $customer->estate
            )
            ->setIdOrigin((new OriginDao)->sqlInsert($origin));

        return $origin;
    }

    /**
     * @param $customer
     * Quando um pagamento é feito com cartão de crédito deve mandar
     * o ID do cartão
     * @param bool $isOpenPriceTrip
     * @param null $cardId
     * @param null $mpToken
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws TripPaymentException
     */
    private function tripPayment(&$customer, bool $isOpenPriceTrip = false, $cardId = null, $mpToken = null, $idTransaction = null)
    {
        /**
         * A query deve conter o userTypeId do cliente
         * pois será validado se é parceiro ou cliente
         */
        $customer = $this->findByUser($this->trip->getUserId());

        if (!$this->trip->getTripPaymentFormId())
            throw new Exception("Forma de pagamento não informada");

        $this->tripPaymentService->tripPayment($customer, $this->trip, $cardId, $mpToken, $isOpenPriceTrip, $idTransaction);
    }

    /**
     * @param stdClass $trip
     * @param null|TripCancellationCustomerFee $cancelFee
     * @return array|mixed
     * @throws Exception
     */
    private function manageBalanceInCancel(stdClass $trip, ?TripCancellationCustomerFee $cancelFee = null)
    {
        $this->customer = $this->findByUser($trip->userId);

        return $this->tripPaymentService
            ->tripPaymentOnCancel(new Trip($trip), $this->customer->balanceId, $cancelFee);
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
     * @param $userId
     * @return array
     * @throws Exception
     */
    public function getCurrentPartnerTrips($userId)
    {
        try {
            $trips = (new TripDao)->sqlSelect(
                [
                    'tripReference',
                    'status',
                    'establishmentId',
                    'userId',
                    'stationId',
                    'originId',
                    'destinationId',
                    'driverId',
                    'price',
                    'customerId'
                ],
                [
                    ['userId', '=', ':userId', 'AND'],
                    ['(status', '<>', ':statusCanceled', 'AND'],
                    ['status', '<>', ':notAnswered', 'AND'],
                    ['status', '<>', ':paymentRefused', 'AND'],
                    ['status', '<>', ':backOff', 'AND'],
                    ['status', '<>', ':statusFinished' . ')', 'AND'],
                    ['customerId', 'is not', 'null']
                ]
            )
                ->bind([
                    ':userId' => $userId,
                    ':statusCanceled' => Trip::CANCELED,
                    ':statusFinished' => Trip::FINISHED,
                    ':notAnswered' => Trip::NOT_ANSWERED,
                    ':paymentRefused' => Trip::PAYMENT_REFUSED,
                    ':backOff' => Trip::BACK_OFF,
                ])
                ->get();

            return array_map(function ($trip) {

                $trip->origin = (new OriginDao)->find($trip->originId);

                $trip->destination = $this->findDestination(new Trip($trip));
                $trip->customer = $this->find($trip->customerId);

                $trip = $this->mountDriverInTrip($trip);

                return $trip;
            }, $trips);
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $trip
     * @return mixed
     * @throws Exception
     */
    private function mountDriverInTrip($trip)
    {
        $trip->driver = $trip->driverId != null ?
            (new DriverDao)->find($trip->driverId) :
            null;

        //        if ($trip->status == Trip::ACCEPTED) {
        //            $trip->driver->estimative = (new GoogleMapsApi)->getDistance(
        //                $trip->driver->location->latitude,
        //                $trip->driver->location->longitude,
        //                $trip->origin->latitude,
        //                $trip->origin->longitude
        //            );
        //        }

        return $trip;
    }

    /**
     * @param \app\model\Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function findDestination(Trip $trip)
    {
        if (!empty($trip->getStationId()))
            return (new StationDao)
                ->find($trip->getStationId(), ['name', 'latitude', 'longitude']);

        return (new DestinationDao)
            ->find($trip->getDestinationId(), ['address AS name', 'latitude', 'longitude']);
    }

    /**
     * Query para login social do parceiro
     * @param User $user
     * @return array|mixed
     */
    private function queryLoginPartner(User $user)
    {
        $resultSql = $this->service->sqlSocialLoginPartner($user);

        $customer = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        return $customer;
    }

    /**
     * @param $tripReference
     * @param $dateEnd
     * @throws Exception
     */
    private function cancelInTrip($tripReference, $dateEnd, $status, $cancellationReasonsId)
    {
        $tripDao = new TripDao;

        switch ($this->customer->userTypeId) {
            case  UserType::CLIENTE_FINAL_PARCEIRO: {
                    $tripDao->cancelByCustomerPartner($tripReference, $dateEnd);
                    break;
                }
            case  UserType::CLIENTE_FINAL: {
                    $tripDao->cancelByCustomer($tripReference, $dateEnd, $status, $cancellationReasonsId);
                    break;
                }
            default: {
                    throw new CustomerException(704);
                }
        }
    }

    /**
     * @param $data
     * @return \app\model\\app\model\Customer
     * @throws Exception
     */
    private function createTripCustomer($data): Customer
    {
        /** @var \app\model\Customer $tripCustomer */
        $tripCustomer = (new CustomerDao)
            ->create($data);

        return $tripCustomer;
    }

    /**
     * Query para login social do usuário final
     * @param User $user
     * @return array|mixed
     */
    private function queryLogin(User $user)
    {
        $resultSql = $this->service->sqlLoginSocial($user);

        return $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);
    }

    /**
     * Vincula uma conta social a um usuário existente
     * @param int $userId ID do usuário
     * @param User $socialUser Dados do usuário social
     * @return bool
     * @throws Exception
     */
    private function linkSocialAccount(int $userId, User $socialUser)
    {
        $updates = [];
        $bind = [':idUser' => $userId];

        if ($socialUser->getGoogleId()) {
            $updates['google_id'] = ':google_id';
            $bind[':google_id'] = $socialUser->getGoogleId();
        }

        if (empty($updates)) {
            return false;
        }

        // Atualiza os dados sociais do usuário na tabela user
        return (new UserDao)->sqlUpdate(
            $updates,
            [['idUser', '=', ':idUser']],
            $bind
        );
    }


    private function queryUpdateSocialLogin($data)
    {
        $sql = "
            UPDATE
                logLoginSocial
            SET
                content = :content,
                expiration = :expiration
            WHERE
                id = :id;
        ";

        return $this->sqlRawUpdate($sql, [
            ':id' => $data->id,
            ':content' => $data->content,
            ':expiration' => $data->expiration
        ]);
    }

    private function queryGetSocialLogin($id)
    {

        $sql = "
            SELECT
                ls.id,
                ls.content
            FROM
                logLoginSocial ls
            WHERE
                id = :id
        ";

        return $this->sqlRawSelect($sql, [
            ':id' => $id
        ])->first();
    }

    /**
     * @param $idUser
     * @return bool|string
     * @throws Exception
     */
    private function updateApiToken($idUser)
    {
        $token = (new UserDao)
            ->updateApiToken($idUser);

        return $this->tokenApi->encrypt($token);
    }

    /**
     * @param $data
     * @param $tripDao
     * @throws TripException
     */
    private function verifyCustomerInTrip($data, &$tripDao): void
    {
        $tripDao = new TripDao;

        if ($data->customerId == null) {
            $tripExists = $tripDao->sqlSelect(
                ['tripReference'],
                [
                    ['userId', '=', ':userId', 'AND'],
                    ['status', 'NOT IN', '(
                            :finishedStatus,
                            :cancelledStatus,
                            :notAnswered,
                            :paymentRefused,
                            :backOff,
                            :scheduled,
                            :stand_by
                        )', 'AND'],
                    ['tripCallTypeId', 'NOT IN', '(:partnerTripCallType, :centralTripCallType)']
                ]
            )
                ->bind([
                    ':userId' => $data->userId,
                    ':finishedStatus' => Trip::FINISHED,
                    ':cancelledStatus' => Trip::CANCELED,
                    ':notAnswered' => Trip::NOT_ANSWERED,
                    ':paymentRefused' => Trip::PAYMENT_REFUSED,
                    ':backOff' => Trip::BACK_OFF,
                    ':scheduled' => Trip::SCHEDULED,
                    ':stand_by' => Trip::STAND_BY,
                    ':partnerTripCallType' => TripCallTypeConst::PARCEIRO,
                    ':centralTripCallType' => TripCallTypeConst::CENTRAL,
                ])
                ->get(false);

            if ($tripExists)
                throw new TripException(200, ['tripReference' => $tripExists->tripReference]);
        }
    }

    /**
     * Retorna o numero da versão do app do cliente final
     * @return mixed
     * @throws Exception
     */
    private function getCustomerAppVersion()
    {
        $version = (new AppDao)
            ->getVersion(AppConst::CUSTOMER, ['version', 'isCritical']);

        $version->isCritical = (bool)$version->isCritical;

        return $version;
    }

    /**
     * @throws Exception
     */
    private function updateTripOnPaymentRefused()
    {
        $tripDao = new TripDao;

        return $tripDao
            ->cancelByCustomer(
                $this->trip->getTripReference(),
                now(),
                Trip::PAYMENT_REFUSED
            );
    }

    /**
     * @param $tripReference
     * @param $driversFound
     * @return float|int
     * @throws Exception
     */
    private function getTimeToExpireTrip($tripReference, $driversFound)
    {
        $driversCalledService = new DriverCalledService;

        return $driversCalledService->getTimeToExpireTrip($tripReference, count($driversFound));
    }

    /**
     * @param $idUser
     * @throws Exception
     */
    private function updatePlatformAndVersion($idUser): void
    {
        $appVersion = Headers::getAppVersion();
        if ($appVersion) {
            $this->updateAppVersion($idUser, $appVersion);
        }

        $platform = Headers::getPlatform();
        if ($platform) {
            $this->userDao
                ->updatePlatform($idUser, $platform);
        }
    }

    /**
     * @param $idUser
     * @param string $appVersion
     * @return bool
     * @throws Exception
     */
    private function updateAppVersion($idUser, string $appVersion)
    {
        return $this->sqlUpdate(
            ['appVersion' => ':appVersion'],
            [['userId', '=', ':userId']],
            [':appVersion' => $appVersion, ':userId' => $idUser]
        );
    }

    public function getCustomerByUserId($userId)
    {
        return $this->sqlSelect(['*'], [['userId', '=', $userId]])->get(false);
    }

    public function getDriversBlockedByCustomer($customerId)
    {
        $blocked = (new RefusedDriverDao())->getAll($customerId);
        $driverIds = array_map(fn($item) => $item->idDriver, $blocked);
        return array_values(array_unique($driverIds));
    }

    private function getBlockedDriversForUser($userId)
    {
        $customerObj = $this->getCustomerByUserId($userId);
        $customerId = $customerObj->idCustomer ?? null;
        if ($customerId) {
            return $this->getDriversBlockedByCustomer($customerId);
        }
        return [];
    }

    public function getDeviceTokenByUserId($userId)
    {
        $sql = "
            SELECT
                u.deviceToken
            FROM user u
            WHERE u.idUser = :idUser
        ";

        $bind = [
            ":idUser" => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }


    /**
     * Verificar se deve auto-aprovar cliente após atualização de dados pessoais
     * @param $userId
     * @throws Exception
     */
    private function checkAutoApprovalAfterDataUpdate($userId)
    {
        // Verificar configuração customer_register_unblocked
        $customerRegisterUnblocked = Config::get('customer_register_unblocked');

        // Se configuração = 1, não faz auto-aprovação (deixa manual)
        if ($customerRegisterUnblocked === '1') {
            return;
        }

        $customer = $this->findByUser($userId);

        // Só verifica se status é PENDING
        if ($customer->customerRegisterStatusId != CustomerRegisterStatusConst::PENDING) {
            return;
        }

        // Verificar se todos os documentos estão aprovados
        $result = $this->sqlRawSelect(
            "SELECT COUNT(*) as count FROM docUser WHERE userId = :userId AND statusId = 1 AND docStatusId != 1",
            [':userId' => $userId]
        )->get(false);
        $allDocsApproved = $result->count == 0;

        // Verificar se dados pessoais estão completos
        $user = (new UserDao)->find($userId);
        $hasCompleteData = $this->validateUserDataComplete($user, $customer);

        // Se tudo OK, auto-aprovar
        if ($allDocsApproved && $hasCompleteData) {
            $this->updateCustomerStatus($customer->idCustomer, CustomerRegisterStatusConst::ATIVO);

            // Log da auto-aprovação
            $this->createLog(
                ['userId' => $userId, 'customerId' => $customer->idCustomer, 'reason' => 'Dados atualizados + documentos aprovados'],
                $customer->idCustomer,
                $userId,
                'CLIENTE AUTO-APROVADO APÓS ATUALIZAÇÃO DE DADOS'
            );
        }
    }

    /**
     * Validar se dados pessoais do usuário estão completos
     * @param $user
     * @param $customer
     * @return bool
     */
    private function validateUserDataComplete($user, $customer)
    {
        // Verificar campos obrigatórios
        $hasDocument = !empty($customer->document ?? $user->document);
        $hasProfileImage = !empty($customer->profileImage) &&
            $customer->profileImage !== 'user.png';
        $hasBirthDate = !empty($customer->dateOfBirth ?? $user->dateOfBirth);

        return $hasDocument && $hasProfileImage && $hasBirthDate;
    }
}
