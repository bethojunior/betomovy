<?php


namespace app\dao;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\UserGroupConst;
use app\utils\BaseDao;
use app\model\DriverAppInfo;

class DriverAppInfoDao extends BaseDao
{
    public $table = 'driverAppInfo';

    public function insert($data)
    {
        $adminNotification = new AdminNotification;
        $driverAppInfo = new DriverAppInfo();

        $driverAppInfo
            ->setVersion($data->version)
            ->setPermissionLocationBackground((int)$data->permissionLocationBackground)
            ->setPermissionGps((int)$data->permissionGps)
            ->setPermissionWriteExternalStorage((int)$data->permissionWriteExternalStorage)
            ->setPermissionSystemOverlay((int)$data->permissionSystemOverlay)
            ->setPermissionIgnoreBatteryOptimization((int)$data->permissionIgnoreBatteryOptimization)
            ->setDriverId($data->driverId)
            ->setId($this->sqlInsert($driverAppInfo));

        if ($data->userId) {
            $adminNotificationType =
                (new AdminNotificationTypeDao)->find(AdminNotificationTypeConst::DRIVER_REPORTS_INFO_APP);

            $adminNotification
                ->setUserId($data->userId)
                ->setIp($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'])
                ->setAdminNotificationTypeId(AdminNotificationTypeConst::DRIVER_REPORTS_INFO_APP)
                ->setUserGroupId(UserGroupConst::DRIVER)
                ->setMessage(str_replace('{name}', $data->name, $adminNotificationType->defaultMessage))
                ->setTitle($adminNotificationType->name)
                ->setId(
                    (new AdminNotificationDao)
                        ->sqlInsert($adminNotification));
        }
        return $driverAppInfo;
    }
}