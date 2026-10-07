<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Card;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2018
 * Time: 16:07
 */
class CustomerCardDao extends BaseDao
{
    protected $table = "card";

    /**
     * @param $userId
     * @param null $cardId
     * @return array|Card
     */
    public function findByUserId($userId, $cardId = null)
    {
        $whereCardId = $cardId ? "AND idCard = :idCard" : '';
        $bind = array();

        if ($cardId)
            $bind[':idCard'] = $cardId;

        $bind[':userId'] = $userId;
        $bind[':statusId'] = Status::ATIVO;

        $sql = /** @lang sql */
            "
            SELECT
                c.idCard,
                c.number,
                c.cardholderName,
                c.cvv,
                c.expirationMonth,
                c.expirationYear,
                c.holderDocument,
                mp.mpCustomerId,
                mp.mpCardId AS mpCardId,
                mp.mpFirstSixDigits,
                mp.mpSecurityCodeLength,
                mp.mpPaymentMethodName,
                mp.mpLastFourDigits,
                c.statusId,
                c.userId,
                c.created_at,
                c.birthDate
            FROM {$this->table} c
              LEFT JOIN mpCardInfo mp ON c.mpCardInfoId = mp.idMpCardInfo
            WHERE userId = :userId AND statusId = :statusId {$whereCardId}
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $cardId
     * @return array|mixed
     */
    public function find($cardId)
    {
        $bind[':idCard'] = $cardId;
        $bind[':statusId'] = Status::ATIVO;

        $sql = /** @lang sql */
            "
            SELECT
                c.idCard,
                c.number,
                c.cardholderName,
                c.cvv,
                c.expirationMonth,
                c.expirationYear,
                c.holderDocument,
                ci.CustomerId,
                ci.cardId AS cardId,
                ci.firstSixDigits,
                ci.securityCodeLength,
                ci.paymentMethodName,
                ci.lastFourDigits,
                mp.mpCustomerId,
                mp.mpCardId AS mpCardId,
                mp.mpFirstSixDigits,
                mp.mpSecurityCodeLength,
                mp.mpPaymentMethodName,
                mp.mpLastFourDigits,
                c.statusId,
                c.userId,
                c.created_at,
                c.birthDate
            FROM {$this->table} c
              LEFT JOIN mpCardInfo mp ON c.mpCardInfoId = mp.idMpCardInfo
              LEFT JOIN cardInfo ci ON c.cardInfoId = ci.id
            WHERE c.idCard = :idCard AND statusId = :statusId
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @param $card
     * @return bool
     * @throws Exception
     */
    public function updateCard(
        $idCard, 
        $cardInfoId,
        $card,
        $cvv = null)
    {
        $result =  $this->sqlUpdate(
            [
                'cardInfoId'      => ':cardInfoId',
                'number'          => ':number',
                'cvv'             => ':cvv',
            ],
            [
                ['idCard', '=', ':idCard']
            ],
            [
                ':cardInfoId' => $cardInfoId,
                ':idCard' => $idCard,
                ':number' => $card['number'],
                ':cvv' => $cvv,
            ]
        );

        return $result;
    }

    /**
     * @param $cardId
     * @return bool
     * @throws Exception
     */
    public function delete($cardId)
    {
        return $this->sqlUpdate(
            ['statusId' => Status::EXCLUIDO],
            [
                ['idCard', '=', ':idCard']
            ],
            [':idCard' => $cardId]
        );
    }
}