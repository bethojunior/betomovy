<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/03/2019
 * Time: 16:47
 */
class CustomerNotificationDao extends BaseDao
{
    protected $table = "notification";

    public function viewedNotification($idNotification, $userId)
    {
        $sql = "UPDATE customerNotification SET customerNotification.read = true
                where customerNotification.notificationId = :idNotification and customerNotification.userId = :userId";

        $bind = [':userId' => $userId, ':idNotification' => $idNotification];

        return $this->sqlRawUpdate($sql, $bind);
    }
}