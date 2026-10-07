<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 07/08/2018
 * Time: 09:02
 */
class MessagesChatTripDao extends BaseDao
{
    protected $table = "messagesChatTrip";

    /**
     * @param $chatTripId
     * @return array|mixed
     */
    public function getMessages($chatTripId)
    {
        return $this->sqlRawSelect("
                SELECT
                    user.name,
                    user.nickname,
                    {$this->table}.idMessagesChatTrip,
                    {$this->table}.message,
                    {$this->table}.userId,
                    {$this->table}.date,
                    {$this->table}.isAudio,
                    CASE 
                        WHEN idDriver IS NULL THEN false
                        ELSE true
                    END as isDriver,
                    IF(idDriver IS NULL, driver.userId, user.idUser) AS userWhoReceivedId
                FROM {$this->table}
                    INNER JOIN user ON user.idUser = {$this->table}.userId
                    INNER JOIN chatTrip ON chatTrip.idChatTrip = {$this->table}.chatTripId
                    LEFT JOIN driver ON driver.userId = user.idUser
                WHERE chatTripId = {$chatTripId} ORDER BY date ASC
            ")->get();
    }

    public function getMessagesByTrip($tripReference, $userId)
    {
        $sql = "
            SELECT
                u.name,
                u.nickname,
                mc.idMessagesChatTrip,
                mc.message,
                mc.userId,
                mc.date
            FROM {$this->table} mc
                INNER JOIN user u ON u.idUser = mc.userId
                INNER JOIN chatTrip ct on mc.chatTripId = ct.idChatTrip
            WHERE
              ct.tripReference = :tripReference AND mc.userId = :userId
            ORDER BY date ASC
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':userId' => $userId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}