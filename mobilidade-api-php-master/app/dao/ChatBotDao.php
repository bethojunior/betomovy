<?php

namespace app\dao;

use app\constant\ChatBotTripTypeConst;
use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 09/04/2019
 * Time: 12:00
 */
class ChatBotDao extends BaseDao
{
    /**
     * @param int $chatBotTripTypeId
     * @return array|mixed
     * @throws Exception
     */
    public function getMessageRandom($chatBotTripTypeId = ChatBotTripTypeConst::NORMAL_TRIP)
    {
        try {
            $sql = "
              SELECT 
                * 
              FROM chatBotTrip
                WHERE 
                    chatBotTripTypeId = :chatBotTripTypeId AND 
                    chatBotTrip.statusId = :statusId
                ORDER BY RAND() LIMIT 1";

            $message = $this->sqlRawSelect($sql, [
                ':chatBotTripTypeId' => $chatBotTripTypeId,
                ':statusId' => Status::ATIVO,
            ])
                ->get(false);
            return $message;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

}