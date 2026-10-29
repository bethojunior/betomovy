<?php

namespace app\services;

use app\constant\CustomerConst;
use app\constant\ExternalServiceActionConst;
use app\constant\GenderConst;
use app\constant\NotificationConst;
use app\constant\PushActionConst;
use app\constant\PushTagConst;
use app\constant\SupportConst;
use app\constant\TemplateEmailConst;
use app\constant\UserConfirmationCodeConst;
use app\dao\CityDao;
use app\dao\ContactUsDao;
use app\dao\CustomerDao;
use app\dao\PushConfigDao;
use app\dao\UserConfirmationCodeDao;
use app\dao\UserDao;
use app\dao\UserIndicationDao;
use app\exceptions\InvalidFieldCustomerException;
use app\exceptions\UserException;
use app\model\ExternalServiceMetaData;
use app\utils\Email;
use app\utils\FormatValue;
// use app\utils\MiltoServiceEmailApi;
use app\utils\MiltoServiceSmsApi;
use app\utils\MexSmsV2;
use app\utils\Pagination;
use app\utils\PhoneMessage;
use app\utils\PhoneNumberNormalizer;
use app\utils\Photo;
use app\utils\Push;
use app\validator\CustomerValidator;
use app\model\Config;
use app\model\ConfigType;
use app\model\ContactUs;
use app\model\Customer;
use app\model\Destination;
use app\model\Driver;
use Exception;
use app\model\LevelAccess;
use app\model\Origin;
use app\model\Place;
use app\model\Status;
use stdClass;
use app\model\Trip;
use app\model\TripPaymentForm;
use app\model\TripType;
use app\model\User;
use app\model\UserConfirmationCode;
use app\model\UserIndication;
use app\model\UserType;
use app\utils\SmsManager;
use app\utils\UtalkWhatsapp;
use app\utils\WhatsappManager;
use app\utils\WhatsAppService;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\UserGroupConst;
use app\utils\WhatsApp\WhatsAppService as WhatsAppServiceVenom;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/10/2018
 * Time: 11:54
 */
class CustomerService
{
    private $table = 'customer';

    /**
     * O parâmetro configMessage deve ser o da tabela de config com a key 'sms_to_customer_in_driver_arrival'
     * @param \app\model\Customer $customer
     * @param Trip $trip
     * @param $configMessage
     * @return mixed
     */
    public function sendSmsInDriverArrival(Customer $customer, Trip $trip, $configMessage)
    {
        $customerName = explode(' ', $customer->getName());
        $configMessage = str_replace('{name}', $customerName[0], $configMessage);
        $configMessage = str_replace('{trip_value}', FormatValue::formatForReal($trip->getPrice()), $configMessage);
        $configMessage = str_replace('{id_trip}', base64_encode($trip->getIdTrip()), $configMessage);

        $phoneMessage = new PhoneMessage($customer->getPhone(), $configMessage);
        return [
            'result_sms' => $phoneMessage->send(),
            'message' => $configMessage
        ];
    }

    /**
     * Returns a array with two keys 'sql' and 'bind'
     * @param \app\model\User $user
     * @return array
     */
    public function sqlLoginPartner(User $user)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();
        $placesTable = (new Place)->getTableName();
        $dbMale = GenderConst::DB_MALE;
        $dbFemale = GenderConst::DB_FEMALE;
        $maleId = GenderConst::MALE_ID;
        $femaleId = GenderConst::FEMALE_ID;

        $sql = "
                SELECT
                  c.idCustomer,
                  u.idUser,
                  u.name AS nameUser,
                  u.nickname,
                  u.email,
                  u.phone,
                  u.document,
                  u.api_token,
                  c.customerRegisterStatusId,
                  c.profileImage,
                  u.gender,
                  CASE u.gender
                    WHEN '{$dbMale}' THEN {$maleId}
                    WHEN '{$dbFemale}' THEN {$femaleId}
                    ELSE NULL
                  END AS genderId,
                  p.idPlace,
                  p.alias,
                  p.address,
                  p.number,
                  p.cityId,
                  p.latitude,
                  p.longitude
                FROM {$this->table} c
                  INNER JOIN {$userTable} u on c.userId = u.idUser
                  INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
                  INNER JOIN {$placesTable} p on c.placeId = p.idPlace
                WHERE
                    u.email = :email AND
                    u.password = :password AND
                    u.statusId = :statusId AND
                    la.userTypeId = :customerPartnerType
            ";

        $bind = [
            ':email' => $user->getEmail(),
            ':password' => $user->getPassword(),
            ':statusId' => Status::ATIVO,
            ':customerPartnerType' => UserType::CLIENTE_FINAL_PARCEIRO
        ];

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    public function sqlSocialLoginPartner(User $user)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();
        $placesTable = (new Place)->getTableName();
        $dbMale = GenderConst::DB_MALE;
        $dbFemale = GenderConst::DB_FEMALE;
        $maleId = GenderConst::MALE_ID;
        $femaleId = GenderConst::FEMALE_ID;

        $sql = "
                SELECT
                  c.idCustomer,
                  u.idUser,
                  u.name AS nameUser,
                  u.nickname,
                  u.email,
                  u.phone,
                  u.document,
                  u.api_token,
                  c.customerRegisterStatusId,
                  c.profileImage,
                  u.gender,
                  CASE u.gender
                    WHEN '{$dbMale}' THEN {$maleId}
                    WHEN '{$dbFemale}' THEN {$femaleId}
                    ELSE NULL
                  END AS genderId,
                  p.idPlace,
                  p.alias,
                  p.address,
                  p.number,
                  p.cityId,
                  p.latitude,
                  p.longitude
                FROM {$this->table} c
                  INNER JOIN {$userTable} u on c.userId = u.idUser
                  INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
                  LEFT JOIN {$placesTable} p on c.placeId = p.idPlace
                WHERE
                    u.email = :email AND
                    u.statusId = :statusId AND
                    la.userTypeId = :customerPartnerType
            ";

        $bind = [
            ':email' => $user->getEmail(),
            ':statusId' => Status::ATIVO,
            ':customerPartnerType' => UserType::CLIENTE_FINAL_PARCEIRO
        ];

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    public function sqlLogin(User $user, $keyAppPartner = null)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();
        $dbMale = GenderConst::DB_MALE;
        $dbFemale = GenderConst::DB_FEMALE;
        $maleId = GenderConst::MALE_ID;
        $femaleId = GenderConst::FEMALE_ID;

        $whereClause = "
        u.email = :email AND
        u.password = :password AND
        u.statusId = :statusId AND
        la.userTypeId = :customerType
        ";

        if (!empty($keyAppPartner)) {
            $whereClause .= " AND u.key_app_partner = :appPartner";
        } else {
            $whereClause .= " AND (u.key_app_partner IS NULL OR u.key_app_partner = '')";
        }

        $bind = [
            ':email' => $user->getEmail(),
            ':password' => $user->getPassword(),
            ':statusId' => Status::ATIVO,
            ':customerType' => UserType::CLIENTE_FINAL
        ];

        if (!empty($keyAppPartner)) {
            $bind[":appPartner"] = $keyAppPartner;
        }

        $sql = "
                SELECT
                  c.idCustomer,
                  u.idUser,
                  u.name AS nameUser,
                  u.nickname,
                  u.email,
                  u.phone,
                  u.document,
                  u.api_token,
                  c.customerRegisterStatusId,
                  c.profileImage,
                  u.gender,
                  CASE u.gender
                    WHEN '{$dbMale}' THEN {$maleId}
                    WHEN '{$dbFemale}' THEN {$femaleId}
                    ELSE NULL
                  END AS genderId,
                  CONCAT(
                    (
                        SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'
                    ), 'customer/profile/compressed/', c.profileImage
                  ) AS profileImageLink
                FROM {$this->table} c
                  INNER JOIN {$userTable} u on c.userId = u.idUser
                  INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
                WHERE {$whereClause}
                ORDER BY c.idCustomer DESC
                LIMIT 1
            ";

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    public function sqlLoginSocial(User $user)
    {
        $userTable = (new User)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();
        $dbMale = GenderConst::DB_MALE;
        $dbFemale = GenderConst::DB_FEMALE;
        $maleId = GenderConst::MALE_ID;
        $femaleId = GenderConst::FEMALE_ID;

        $where = $this->getWhereForLoginSocial($user);

        $sql = "
                SELECT
                  c.idCustomer,
                  u.idUser,
                  u.name AS nameUser,
                  u.nickname,
                  u.email,
                  u.phone,
                  u.document,
                  u.api_token,
                  u.zipcode,
                  u.addressNumber,
                  c.customerRegisterStatusId,
                  c.profileImage,
                  u.gender,
                  CASE u.gender
                    WHEN '{$dbMale}' THEN {$maleId}
                    WHEN '{$dbFemale}' THEN {$femaleId}
                    ELSE NULL
                  END AS genderId,
                  CONCAT(
                    (
                        SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'
                    ), 'customer/profile/compressed/', c.profileImage
                  ) AS profileImageLink
                FROM {$this->table} c
                  INNER JOIN {$userTable} u on c.userId = u.idUser
                  INNER JOIN {$levelAccessTable} la on u.idUser = la.userId
                WHERE
                    {$where['string']} AND
                    u.statusId = :statusId AND
                    la.userTypeId = :customerType
                ORDER BY c.idCustomer DESC
                LIMIT 1
            ";

        $bind = [
            $where['bindKey'] => $where['bindValue'],
            ':statusId' => Status::ATIVO,
            ':customerType' => UserType::CLIENTE_FINAL
        ];

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    private function getWhereForLoginSocial(User $user)
    {
        $where = array();

        if (!empty($user->getGoogleId())) {
            $where['string'] = 'u.google_id = :google_id';
            $where['bindKey'] = ':google_id';
            $where['bindValue'] = $user->getGoogleId();
            
            return $where;
        }

        if (!empty($user->getEmail())) {
            $where['string'] = 'u.email = :email';
            $where['bindKey'] = ':email';
            $where['bindValue'] = $user->getEmail();

            return $where;
        }

        if (!empty($user->getPhone())) {
            $where['string'] = 'clearPhone(u.phone) = :phone';
            $where['bindKey'] = ':phone';
            $where['bindValue'] = FormatValue::formatPhoneClear($user->getPhone());

            return $where;
        }

        if (!empty($user->getIdUser())) {
            $where['string'] = 'u.idUser = :userId';
            $where['bindKey'] = ':userId';
            $where['bindValue'] = $user->getIdUser();

            return $where;
        }
        
        $where['string'] = 'u.facebook_id = :facebook_id';
        $where['bindKey'] = ':facebook_id';
        $where['bindValue'] = $user->getFacebookId();

        return $where;
    }

    /**
     * @param User $user
     * @return array
     * @throws \PHPMailer\PHPMailer\Exception
     * @throws Exception
     */
    public function sendRecoveryCode(User $user)
    {
        $code = PhoneMessage::generateConfirmationCode();

        $response[] = $this->sendRecoveryCodeByWhatsApp($user->getPhone(), $code);
        $response[] = $this->sendRecoveryCodeBySms($user->getPhone(), $code, $user->getCityId() ?? null);
        $response[] = $this->sendRecoveryCodeByEmail($user->getEmail(), $code);
        $response['code'] = $code;
        
        $userConfirmationCode = new UserConfirmationCode;
        $userConfirmationCode
            ->setCode($code)
            ->setData(json_encode([
                'user' => $user->toStdClass(),
                'response' => $response
            ]))
            ->setUserId($user->getIdUser())
            ->setType(UserConfirmationCodeConst::TYPE_FORGOT_PASSWORD)
            ->setValidUntil(addMinutes(now(), 5))
            ->setId(
                (new UserConfirmationCodeDao)->sqlInsert($userConfirmationCode)
            );

        return $response;
    }

    /**
     * @param User $user
     * @return array
     * @throws \PHPMailer\PHPMailer\Exception
     * @throws Exception
     */
    public function sendRecoveryCodePro(User $user, ?int $notificationType)
    {
        $code = PhoneMessage::generateConfirmationCode();
        $this->sendRecoveryCodeByWhatsApp($user->getPhone(), $code);
        
        switch ($notificationType) {
            case NotificationConst::EMAIL: $response = $this->sendRecoveryCodeByEmail($user->getEmail(), $code);
                break;
            case NotificationConst::SMS: $response = $this->sendRecoveryCodeBySms($user->getPhone(), $code);
                break;
            default:
                $response[] = $this->sendRecoveryCodeByEmail($user->getEmail(), $code);
                $response[] = $this->sendRecoveryCodeBySms($user->getPhone(), $code);
                break;
        }

        $response['code'] = $code;

        $response['user'] = $user->toStdClass();

        $userConfirmationCode = new UserConfirmationCode;
        $userConfirmationCode
            ->setCode($code)
            ->setData(json_encode([
                'user' => $user->toStdClass(),
                'response' => $response
            ]))
            ->setUserId($user->getIdUser())
            ->setType(UserConfirmationCodeConst::TYPE_FORGOT_PASSWORD)
            ->setValidUntil(addMinutes(now(), 5))
            ->setId(
                (new UserConfirmationCodeDao)->sqlInsert($userConfirmationCode)
            );

        return $response;
    }

    /**
     * @param $userId
     * @param $message
     * @return stdClass
     */
    public function sendHelpMeEmail($userId, $message)
    {
        $contactMessage = new ContactUs;
        $contactMessage
            ->setUserId($userId)
            ->setMessage($message)
            ->setUserTypeId(UserType::CLIENTE_FINAL)
            ->setIdContactUs(
                (new ContactUsDao)->sqlInsert($contactMessage)
            );

        $this->createAdminNotificationForHelpMeEmail($userId, $message);

        return $contactMessage->toStdClass();
    }

    private function createAdminNotificationForHelpMeEmail($userId, $message)
    {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];
        
        $adminNotificationType = (new AdminNotificationTypeDao)
        ->find(AdminNotificationTypeConst::CONTACT_US_CLIENT);
        
        $user = (new UserDao)->find($userId, ['name', 'email', 'cityId']);
        
        $notificationMessage = str_replace(
            ['{userName}', '{message}'],
            [$user->name, $message],
            $adminNotificationType->defaultMessage
        );

        $adminNotification = new AdminNotification;
        $adminNotification
        ->setUserId($userId)
        ->setIp($ip)
        ->setAdminNotificationTypeId(AdminNotificationTypeConst::CONTACT_US_CLIENT)
        ->setUserGroupId(UserGroupConst::CLIENT)
        ->setMessage($notificationMessage)
        ->setTitle($adminNotificationType->name)
        ->setCityId($user->cityId ?? null)
        ->setId(
            (new AdminNotificationDao)->sqlInsert($adminNotification)
        );
    }

    /**
     * @param $request
     * @return array
     */
    public function getWhereForGetTrips($request)
    {
        $where = [
            ['c.idCustomer', '=', ':customerId', 'AND'],
            ['t.centralId', 'IS', 'NULL'],
        ];

        // status ausente ou `true` (filtro "Todos") também deve excluir viagens sem motorista
        $hasStatusFilter = isset($request->status) && $request->status !== true;

        if (!$hasStatusFilter) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['t.driverId', 'IS', 'NOT NULL'];
        }

        $bind = [':customerId' => $request->customerId];

        if ($hasStatusFilter) {
            if (is_string($request->status)) {
                $where[count($where) - 1][] = 'AND';
                $where[] = ['t.status', '=', ':status'];
                $bind[':status'] = $request->status;
            }

            if (is_array($request->status)) {
                $where[count($where) - 1][] = 'AND';
                foreach ($request->status as $key => $status) {
                    $or = end($request->status) == $status ? ')' : 'OR';
                    $start = $request->status[0] == $status ? '(' : '';

                    $where[] = [$start . 't.status', '=', ':status' . $key, $or];
                    $bind[':status' . $key] = $status;
                }
            }
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

    /**
     * @param $totalRows
     * @param $where
     * @param $page
     * @return array
     */
    public function getSqlForGetTrips($totalRows, $where, $page)
    {
        $tripTable = (new Trip)->getTableName();
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $originTable = (new Origin)->getTableName();
        $destinationTable = (new Destination)->getTableName();
        $tripPaymentTable = (new TripPaymentForm)->getTableName();
        $tripTypeTable = (new TripType)->getTableName();

        $pagination = new Pagination($totalRows, $page);

        $whereString = $this->getWhereLikeString($where);

        $sql =
        /** @lang sql */ "
            SELECT
              t.tripReference,
              ud.name AS driverName,
              u.name AS customerName,
              o.address AS originAddress,
              o.latitude AS originLatitude,
              o.longitude AS originLongitude,
              dest.address AS destinationAddress,
              dest.latitude AS destinationLatitude,
              dest.longitude AS destinationLongitude,
              DATE_FORMAT(t.date, '%d de %M de %Y - %H:%i') AS dateFormatted,
              tPF.name AS paymentForm,
              t.date,
              t.status,
              t.endDate,
              t.price,
              tt.type
            FROM {$tripTable} t
              INNER JOIN {$userTable} u on t.userId = u.idUser
              INNER JOIN {$originTable} o on t.originId = o.idOrigin
              INNER JOIN {$destinationTable} dest on t.destinationId = dest.idDestination
              INNER JOIN {$this->table} c on u.idUser = c.userId
              INNER JOIN {$tripPaymentTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
              INNER JOIN {$tripTypeTable} tt on t.tripTypeId = tt.idTripType
              LEFT JOIN {$driverTable} d ON t.driverId = d.idDriver
              LEFT JOIN {$userTable} ud on d.userId = ud.idUser
            WHERE {$whereString} ORDER BY t.date DESC LIMIT {$pagination->getLimit()}
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    /**
     * @param $where
     * @return string
     */
    public function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    /**
     * Returns the new photo's name
     * @param $oldPhoto
     * @param $newPhoto
     * @return string
     * @throws Exception
     */
    public function updateProfileImage($oldPhoto, $newPhoto)
    {
        $photo = new Photo;

        if ($oldPhoto != CustomerConst::DEFAULT_IMAGE_NAME)
            $photo->remove($oldPhoto, CustomerConst::PROFILE_IMAGE_DIR);

        return $photo->save($newPhoto, CustomerConst::PROFILE_IMAGE_DIR);
    }

    public function notifyOnExpiredTrip($deviceToken, bool $scheduledTrip = false)
    {
        if (!$deviceToken)
            return null;

        $pushConfig = $scheduledTrip ? (new PushConfigDao())->find('expired_scheduled_trip') :
            (new PushConfigDao())->find('expired_trip');

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle($pushConfig->getTitle())
            ->setAction(PushActionConst::NOTIFY_CUSTOMER_ON_TRIP_EXPIRED)
            ->setTag(PushTagConst::NOTIFY_CUSTOMER_ON_TRIP_EXPIRED)
            ->setBody(
                $pushConfig->getMessage());

        return $push->sendNotification();
    }

    /**
     * @param $userId
     * @param $message
     * @return string
     * @throws Exception
     */
    private function getHelpMeMessage($userId, $message)
    {
        $customer = (new UserDao)->find($userId, ['name', 'email']);

        $mountedMessage = SupportConst::MESSAGE_TO_TALK_US_EMAIL;
        $mountedMessage = str_replace('{name}', $userId . ' - ' . $customer->name, $mountedMessage);
        $mountedMessage = str_replace('{email}', $customer->email, $mountedMessage);

        return $mountedMessage . $message;
    }

    /**
     * @param $email
     * @param $code
     * @return bool
     * @throws \PHPMailer\PHPMailer\Exception
     * @throws Exception
     */
    private function sendRecoveryCodeByEmail($email, $code)
    {
        $subject = Config::get('recovery_password_email_subject', ConfigType::CUSTOMER);
        $message = Config::get('recovery_password_email', ConfigType::CUSTOMER);
        $message = str_replace('{code}', $code, $message);

        $response = Email::sendMail($email, $subject, $subject, $message, TemplateEmailConst::CONFIRMATION_EMAIL);

        return $response;
    }

    private function sendRecoveryCodeBySms($phone, $code, int $cityId = null)
    {
        $phoneMessage = new PhoneMessage($phone, null, null, $cityId);
        $message = Config::get('recovery_password_message', ConfigType::CUSTOMER);
        $message = str_replace('{code}', $code, $message);

        $phoneMessage->setMessage($message);

        $miltoTokenApiNameSms = ExternalServiceMetaData::get('token_api_name_milto_service_sms');
        $miltoTokenApiSms = ExternalServiceMetaData::get('token_api_milto_service_sms');

        if (!is_null($miltoTokenApiNameSms) && !is_null($miltoTokenApiSms)) {
            $sendSms = new MiltoServiceSmsApi($phone, $message, $cityId);

            return $sendSms->send();
        }

        return $phoneMessage->send();
    }

    private function sendRecoveryCodeBySmsGeneral($phone, $code)
    {
        $smsManager = new SmsManager(
            new MexSmsV2(env('SMS_MEX_URL'), env('SMS_MEX_TOKEN'))
        );

        $message = Config::get('recovery_password_message', ConfigType::CUSTOMER);
        $message = str_replace('{code}', $code, $message);

        $phone = PhoneNumberNormalizer::toDialable($phone);
        $smsManager->send($phone, $message);

        return true; 
    }

    private function sendRecoveryCodeByWhatsappGeneral($phone, $code)
    {
        $u = new UtalkWhatsapp(env('WPP_URL_UTALK'), env('WPP_TOKEN_UTALK'));

        $whatsappManager = new WhatsappManager($u);

        $message = Config::get('recovery_password_message', ConfigType::CUSTOMER);
        $message = str_replace('{code}', $code, $message);

        $phone = PhoneNumberNormalizer::toDialable($phone);
        $whatsappManager->sendTextMessage($phone, $message);

        return true; 
    }
    
    private function sendRecoveryCodeByWhatsapp($phone, $code)
    {
        $phone = PhoneNumberNormalizer::toDialable($phone);
        $whatsAppService = new WhatsAppServiceVenom();
        $mensagem = "Olá, tudo bem? 😊\n\n" .
                    "Recebemos uma solicitação para recuperar sua senha.\n" .
                    "Seu código de verificação é: *{$code}*\n\n" .
                    "Se não foi você quem solicitou, ignore esta mensagem.";
        return $whatsAppService->handle($phone, $mensagem);
    }

    /**
     * @param $data
     * @return array
     * @throws InvalidFieldCustomerException
     */
    public function mountEditProfile($data)
    {
        $set = [];
        $bind = [];

        if (!$data->idUser)
            throw new InvalidFieldCustomerException("ID do usuário não enviado", 'idUser');

        if (isset($data->password))
            $data->password = (new User($data))->getPassword();

        foreach ($data as $key => $value) {
            if ($value) {
                if ($key != 'idUser')
                    $set[$key] = ":$key";

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
     * @param $request
     * @return stdClass
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function sendConfirmationSms($request)
    {
        $code = PhoneMessage::generateConfirmationCode();
        $city = isset($request->latitude) && isset($request->longitude) ? (new CityDao())->findByCoordinate($request->latitude, $request->longitude) : null;

        $response = new stdClass();
        $response->sms = $code;

        if (isset($request->number)) {
            $sms = new PhoneMessage($request->number, CustomerConst::CONFIRMATION_CODE . $code, null, $city->id ?? null);
            $response->response_sms = $sms->send(
                ExternalServiceActionConst::CONFIRMATION_MESSAGE_CUSTOMER_REGISTER);
        }

        if (isset($request->email)) {
            $appTitle = Config::get('app_title');

            $response->result = Email::sendMail(
                $request->email,
                "Confirmação de email",
                "{$appTitle}: Confirmação de email",
                "
                <h3>Seu código de confirmação é: {$code}</h3>"
            );
        }

        return $response;
    }

    /**
     * @param $whoIndicatedId
     * @param $indicatedId
     * @return UserIndication
     */
    public function createCustomerIndication($whoIndicatedId, $indicatedId)
    {
        $userIndication = new UserIndication;
        $userIndication
            ->setWhoIndicatedId($whoIndicatedId)
            ->setUserIndicatedId($indicatedId)
            ->setId(
                (new UserIndicationDao)
                    ->sqlInsert($userIndication));

//        $customerIndication = new CustomerIndication;
//        $customerIndication
//            ->setWhoIndicatedId($whoIndicatedId)
//            ->setIndicatedId($indicatedId)
//            ->setId(
//                (new CustomerIndicationDao)
//                    ->sqlInsert($customerIndication)
//            );

        return $userIndication;
    }

    public function requestDeleteData($request)
    {
        $user = new User($request);
        (new CustomerValidator)->validateLogin($user, true);

        $resultSql = $this->sqlLogin($user);

        $customer = (new CustomerDao)->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if (!$customer)
            throw new UserException(801, $user->toStdClass());

        (new UserDao)->removeUser($customer->idUser);

        return null;
    }
}
