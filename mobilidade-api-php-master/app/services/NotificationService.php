<?php

namespace app\services;

use app\dao\CustomerNotificationDao;
use app\dao\NotificationDao;
use app\utils\Pagination;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/03/2019
 * Time: 14:41
 */
class NotificationService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new NotificationDao;
    }

    /**
     * @param $userId
     * @param $page
     * @return array
     */
    public function list($userId, $page)
    {
        $countNotification = $this->dao->countNotification($userId);

        $pagination = new Pagination($countNotification->total, $page);

        $data = $pagination->getPaginationInfo();

        $data['data'] = $this->dao->getAll($userId, $pagination->getLimit());

        return $data;

    }

    /**
     * @param $idNotification
     * @param $userId
     * @return bool
     */
    public function toView($idNotification, $userId)
    {
        $customerNotificationDao = new CustomerNotificationDao;
        return $customerNotificationDao->viewedNotification($idNotification, $userId);
    }

    public function findByUser($id, $page = 1, $per_page = 20)
    {
        return $this->dao->findByUser($id, $page, $per_page);
    }

    public function viewed($data)
    {
        return $this->dao->sqlRawUpdate('
            UPDATE notificationUser
            SET viewed = 1
            WHERE userId = :userId
              AND notificationId IN (' . implode(',', $data->notifications) . ');
        ', [':userId' => $data->idUser]);
    }
}