<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/03/2019
 * Time: 14:47
 */
class NotificationDao extends BaseDao
{
    protected $table = "notification";


    public function getAll($userId, $limit)
    {
        $sql = "
            SELECT 
              n.idNotification,
              n.title,
              n.message,
              n.link,
              n.image,
              n.notificationTypeId,
              n.date,
              cn.read
            FROM {$this->table} n
              INNER JOIN customerNotification cn  on cn.notificationId = n.idNotification
            WHERE cn.userId = :userId LIMIT {$limit}";

        $bind = [':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)->get();
    }

    /**
     * @param $userId
     * @return array|mixed
     */
    public function countNotification($userId)
    {
        $sql = "SELECT count(*) as total
                    FROM {$this->table} n
                      INNER JOIN customerNotification cn  on cn.notificationId = n.idNotification
                    WHERE cn.userId = :userId";

        $bind = [':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)->get(false);
    }

    public function findByUser($id, $page = 1, $per_page = 20)
    {
        $offset = (($page >= 1 ? $page : 1) - 1) * $per_page;

        $sql = "
            SELECT idNotification,
                   title,
                   message,
                   if(identifyUserInLink, if(link like '%?%', concat(link, '&q=', TO_BASE64(userId)), concat(link, '?q=', TO_BASE64(userId))),
                      link) as link,
                   image,
                   date,
                   viewed
            FROM {$this->table}
                     INNER JOIN notificationUser nU ON {$this->table}.idNotification = nU.notificationId
            WHERE userId = :userId
            AND {$this->table}.statusId = 1
            ORDER BY date DESC
            LIMIT {$per_page} OFFSET {$offset};
        ";

        $bind = [
            ':userId' => $id
        ];

        return $this->sqlRawSelect($sql, $bind)->get(true);
    }
}