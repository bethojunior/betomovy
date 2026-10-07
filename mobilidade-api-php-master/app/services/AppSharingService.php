<?php

namespace app\services;

use app\constant\AppConst;
use app\constant\AppSharingConst;
use app\constant\CodeFavoriteConst;
use app\dao\AppDao;
use app\dao\AppSharingDao;
use app\dao\CityDao;
use app\dao\DriverDao;
use app\dao\UserDao;
use app\exceptions\AppSharingException;
use app\utils\FormatValue;
use app\utils\Headers;
use app\utils\PhoneMessage;
use app\validator\AppSharingValidator;
use app\model\AppSharing;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/01/2019
 * Time: 11:23
 */
class AppSharingService
{
    private $dao;
    private $validator;
    private $userDao;
    private $driverDao;

    public function __construct()
    {
        $this->dao = new AppSharingDao;
        $this->userDao = new UserDao;
        $this->driverDao = new DriverDao;
        $this->validator = new AppSharingValidator;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function insert($request)
    {
        $request->userId = $request->userId ?? Headers::getUserId();

        $this->validator->validateInsert($request);

        $appSharing = new AppSharing;
        $appSharing
            ->setPhone(
                isset($request->phone) ?
                    FormatValue::formatPhoneClear($request->phone) : null
            )
            ->setUserId($request->userId)
            ->setAppId($request->appId)
            ->setFormOfSharing($request->formOfSharing ?? null)
            ->setIp(
                $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR']
            )
            ->setLatitude($request->location->latitude)
            ->setLongitude($request->location->longitude)
            ->setIdAppSharing(
                $this->dao->sqlInsert($appSharing)
            );

        $message = $this->getMessage($request);
        $city = (new CityDao())->findByCoordinate($request->location->latitude, $request->location->longitude);

        if (isset($request->formOfSharing) &&
            $request->formOfSharing == AppSharingConst::SMS_FORM)
            $this->notify($request, $message, $city->id ?? null);

        return compact('message');
    }

    private function notify($request, string $message, int $cityId = null): array
    {
        $phoneMessage = new PhoneMessage($request->phone, $message, null, $cityId);

        return $phoneMessage->send();
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    private function getUser($userId)
    {
        $user = $this->userDao
            ->findWithUserType($userId);

        if ($user->isDriver)
            return $this->driverDao
                ->findByUserId($userId, false);

        return $user;
    }

    /**
     * @param $request
     * @return string
     * @throws AppSharingException
     * @throws Exception
     */
    private function getMessage($request)
    {
        $user = $this->getUser($request->userId);
//        $app = $this->appDao
//            ->find($request->appId);

        switch ((int)$request->appId) {
            case AppConst::DRIVER:
                $configMessage = Config::get('appSharingDriverMessage');

                return $configMessage . "\n" . $this->getDriverPreRegisterLink($request->userId);
            case AppConst::CUSTOMER:
                $configMessage = Config::get('appSharingCustomerMessage');

                if (isset($user->isDriver) && $user->isDriver)
                    return
                        $configMessage .
                        "\nMeu Código: " . CodeFavoriteConst::makeCode(
                            $user->nickname,
                            $user->idDriver,
                            $user->userTypeId) .
                        "\n" . $this->getCustomerPreRegisterLink($request->userId);


                return $configMessage . "\n" . $this->getCustomerPreRegisterLink($request->userId);
            default:
                throw new AppSharingException(1481);
        }
    }

    private function getDriverPreRegisterLink($userId)
    {
        return str_replace('{userId}',
            base64_encode($userId), Config::get("link_driver_pre_register"));
    }

    /**
     * @param $userId
     * @return string
     */
    private function getCustomerPreRegisterLink($userId)
    {
        return str_replace('{userId}',
            base64_encode($userId), Config::get("link_customer_pre_register"));
    }
}