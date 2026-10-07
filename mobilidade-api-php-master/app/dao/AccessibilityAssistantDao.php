<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/09/2019
 * Time: 17:26
 */
class AccessibilityAssistantDao extends BaseDao
{
    protected $table = 'accessibilityAssistant';

    public function findByTripReference($tripReference)
    {
        $sql = "
            SELECT
                aa.accessibilityId,
                aa.helpId,
                aa.actionId,
                aa.quantity,
                ah.name AS description,
                ah.picture,
                ph.value,
                aac.name AS action
            FROM {$this->table} aa
              INNER JOIN accessibility a ON a.id = aa.accessibilityId
              INNER JOIN trip t on a.tripReference = t.tripReference
              INNER JOIN accessibilityAction aac ON aac.id = aa.actionId
              INNER JOIN accessibilityHelp ah ON
                  (ah.id = aa.helpId AND ah.statusId = :status)
              INNER JOIN priceHelp ph ON
                  (
                      ph.accessibilityHelpId = aa.helpId AND
                      ph.statusId = :status AND
                      ph.cityId = t.cityId
                  )
            WHERE
              a.tripReference = :tripReference
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}