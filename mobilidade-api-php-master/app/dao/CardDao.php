<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 10:06
 */
class CardDao extends BaseDao
{
    /**
     * @param $establishmentId
     * @return array|mixed
     * @throws Exception
     */
    public function getByEstablishment($establishmentId)
    {
        try {
            return $this->sqlSelect([], [
                ['establishmentId', '=', $establishmentId, 'AND'],
                ['statusId', '=', Status::ATIVO]
            ])->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $cardId
     * @return array|mixed
     * @throws Exception
     */
    public function find($cardId)
    {
        try {
            $card = $this->sqlSelect([], [
                ['idCard', '=', $cardId, 'AND'],
                ['statusId', '=', Status::ATIVO]
            ])->get(false);

            if (empty($card))
                throw new Exception("Cartão não encontrado");

            return $card;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $cardId
     * @return bool
     * @throws Exception
     */
    public function delete($cardId)
    {
        try {
            return $this->sqlUpdate(
                ['statusId' => Status::EXCLUIDO],
                [['idCard', '=', $cardId]]
            );
        } catch (Exception $e) {
            throw $e;
        }
    }
}