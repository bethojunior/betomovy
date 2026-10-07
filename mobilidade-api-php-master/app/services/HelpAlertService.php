<?php


namespace app\services;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\PushActionConst;
use app\constant\UserGroupConst;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\dao\CarDao;
use app\dao\CityConfigDao;
use app\dao\DriverDao;
use app\dao\DriversCloseDao;
use app\dao\EmergencyMonitoringTypeDao;
use app\dao\PushConfigDao;
use app\dao\TripDao;
use app\dao\UserDao;
use app\exceptions\PushException;
use app\model\Driver;
use app\utils\GeocodingService;
use app\utils\Photo;
use app\utils\Push;
use app\model\Car;
use app\model\Config;
use Exception;
use app\model\PushConfig;
use app\model\User;

class HelpAlertService
{
    /**
     * @var DriversCloseDao
     */
    private $dao;
    /**
     * @var PushConfigDao
     */
    private $pushConfigDao;
    /**
     * @var PushConfig|null
     */
    private $defaultMessage;
    /**
     * @var UserDao
     */
    private $userDao;
    private $adminNotificationTypeDao;
    private $tripDao;
    private $geocodingService;
    private $carDao;
    private $emergencyMonitoringTypeDao;
    private $cityConfigDao;

    public function __construct()
    {
        $this->dao = new DriversCloseDao;
        $this->pushConfigDao = new PushConfigDao;
        $this->userDao = new UserDao;
        $this->adminNotificationTypeDao = new AdminNotificationTypeDao;
        $this->emergencyMonitoringTypeDao = new EmergencyMonitoringTypeDao;
        $this->cityConfigDao = new CityConfigDao;
        $this->tripDao = new TripDao;
        $this->geocodingService = new GeocodingService;
        $this->carDao = new CarDao;

        $this->defaultMessage = $this->pushConfigDao
            ->find('alert_for_driver_in_danger')
            ->getMessage();
    }

    /**
     * @param $request
     * @param $userId
     * @return bool
     * @throws Exception
     */
    public function askForHelp($request, $userId)
    {
        $this->validateRequest($request);

        $driversClose = $this->dao
            ->findCloseForAlert($request->lat, $request->lng, $userId);

        $user = $this->userDao->find($userId, ['idUser', 'name']);

        $link = $this->createAdminNotification(new User($user), $request);

        $car = $this->carDao->getByUser($userId);

        foreach ($driversClose as $driver) {
            $this->sendPush(
                (float)$driver->proximity,
                $user->name,
                $driver->deviceToken,
                $request->lat,
                $request->lng,
                (!$car ? null : new Car($car)),
                $request->emergencyMonitoringTypeId ?? null,
                $link
            );
        }

        return true;
    }

    public function askForHelpWithData($request, $userId)
    {
        $this->validateRequest($request);

        $driversClose = $this->dao
            ->findCloseForAlert($request->lat, $request->lng, $userId);

        $user = $this->userDao->find($userId, ['idUser', 'name']);

        $link = $this->createAdminNotification(new User($user), $request);

        $car = $this->carDao->getByUser($userId);

        foreach ($driversClose as $driver) {
            $this->sendPush(
                (float)$driver->proximity,
                $user->name,
                $driver->deviceToken,
                $request->lat,
                $request->lng,
                (!$car ? null : new Car($car)),
                $request->emergencyMonitoringTypeId ?? null,
                $link,
            );
        }

        return true;
    }


    /**
     * @param $request
     * @throws Exception
     */
    private function validateRequest($request)
    {
        if (!isset($request->lat) || empty($request->lat))
            throw new Exception("Latitude não é valida");

        if (!isset($request->lng) || empty($request->lng))
            throw new Exception("Longitude não é valida");
    }

    /**
     * @param float $proximity
     * @param string $name
     * @param string $deviceToken
     * @param string $lat
     * @param string $lng
     * @param \app\model\Car|null $car
     * @param null $emergencyMonitoringTypeId
     * @throws Exception
     */
    private function sendPush(
        float $proximity, string $name, string $deviceToken, string $lat, string $lng, ?Car $car = null, $emergencyMonitoringTypeId = null, $link = null)
    {
        $locale = $this->geocodingService
            ->search("{$lat},{$lng}", true);

        $carData = $car ? (
            "| Carro: " .
            $car->getBrand() . " " .
            $car->getModel() . " " .
            $car->getColor() . " " .
            "Placa: {$car->getPlate()}" . " "
        ) : '';

        $message = str_replace(
            ['{driverName}', '{distance}', '{address}', '{carData}'],
            [
                $name,
                (string)round($proximity, 2),
                $locale->getAddress(),
                $carData
            ], $this->defaultMessage);

        if ($emergencyMonitoringTypeId)
            $message .= $this->findEmergencyMonitoringTypeMessage($emergencyMonitoringTypeId);

        $data = ["link" => $link, "lat" => $lat, "lng" => $lng];

        $this->trigger($message, $deviceToken, $data);
    }

    private function createAdminNotification(User $user, $request)
    {
        $city = $this->cityConfigDao->getByCoordinate($request->lat, $request->lng);

        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        $adminNotificationType = $this->adminNotificationTypeDao
            ->find(AdminNotificationTypeConst::PANIC_BUTTON);

        $message = str_replace('{userName}', $user->getName(), $adminNotificationType->defaultMessage);

        if (isset($request->photo) && !empty($request->photo)) {
            $photo = new Photo;
            $photoFile = $photo->save((array)$request->photo, Driver::DOC_DIR, $user->getIdUser() ?? '' . 'alert-');
            $replaceFile = str_replace('https://', '', env('S3_URL'));

            $linkUrlPhoto = 'https://' . $replaceFile . env('S3_BUCKET_NAME') . '/' . Driver::DOC_DIR . Photo::COMPRESSED_DIR . $photoFile;
        }

        if (isset($request->emergencyMonitoringTypeId))
            $message .= $this->findEmergencyMonitoringTypeMessage($request->emergencyMonitoringTypeId);

        try {
            $trip = $this->tripDao
                ->findCurrentByUserCustomer($user->getIdUser(), false);

            if (!$trip) {
                $driver = (new DriverDao)
                    ->findByUserId($user->getIdUser(), false);

                if ($driver)
                    $trip = $this->tripDao
                            ->findCurrentByDriver($driver->idDriver, false)[0] ?? null;
            }

            $link = Config::get('trip_sharing_link');

            if ($link && $trip) {
                $link = str_replace('{tripReference}', $trip->tripReference, $link);
                $message = "<p>{$message} Link: <a href='{$link}' target='_blank'>{$link}</a></p>";
            } else {
                $link = null;
            }

        } catch (Exception $e) {
            $trip = null;
        }

        $adminNotification = new AdminNotification;
        $adminNotification
            ->setUserId($user->getIdUser())
            ->setIp($ip)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::PANIC_BUTTON)
            ->setLat($request->lat ?? null)
            ->setLng($request->lng ?? null)
            ->setUserGroupId(UserGroupConst::DRIVER)
            ->setMessage($message)
            ->setPicture($linkUrlPhoto ?? null)
            ->setTitle($adminNotificationType->name)
            ->setTripReference($trip->tripReference ?? null)
            ->setEmergencyMonitoringTypeId($request->emergencyMonitoringTypeId ?? null)
            // disparo localização da viagem, e caso ele não esteja em nenhuma, eu mando a localização atual dele e busco no nosso banco se ele tem essa cidade cadastrada, caso contrario eu disparo do cadastro dele.
            ->setCityId($trip->cityId ?? ($city->cityId ?? $driver->cityId) ?? null)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));

//        $this->sendEmailToAdmins($message, $adminNotificationType->name);
        return $link;
    }

    private function sendEmailToAdmins($message, $title)
    {
        $message = "\"{$message}\"";
        $title = "\"{$title}\"";

        backgroundTask('notify-admins', $message, $title);
    }

    private function findEmergencyMonitoringTypeMessage($emergencyMonitoringTypeId): string
    {
        $emergencyMonitoringType = $this->emergencyMonitoringTypeDao->findById($emergencyMonitoringTypeId);

        if ($emergencyMonitoringType)
            return " Motivo: " . $emergencyMonitoringType->name;

        return "";
    }

    /**
     * @param $message
     * @param $deviceToken
     * @param $data
     * @return mixed
     * @throws PushException
     */
    private function trigger($message, $deviceToken, $data)
    {
        $push = new Push;
        $push
            ->setBody($message)
            ->setMessage($message)
            ->setDeviceToken($deviceToken)
            ->setAdditionalData($data)
            ->setAction(PushActionConst::NOTIFY_DEFAULT);

        return $push->sendNotificationWithData();
    }
}