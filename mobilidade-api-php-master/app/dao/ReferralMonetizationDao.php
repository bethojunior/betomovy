<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 17:22
 */
class ReferralMonetizationDao extends BaseDao
{
    protected $table = "referralMonetization";

    public function findUserLevel($userId, ?int $cityId = null)
    {
        $queryCity = " AND rM.cityId IS NULL";
        $bind      = [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO,
        ];

        if (!empty($cityId)) {
            $queryCity       = " AND (rM.cityId = :cityId OR rM.cityId IS NULL)";
            $bind[':cityId'] = $cityId;
        }

        $sql = /** @lang sql */ "
             SELECT
                uiv.userIndications,
                (
                    SELECT
                        rM.label
                    FROM
                         referralMonetization rM
                        WHERE
                            rM.statusId = :statusId AND
                            rM.indications <= uiv.userIndications 
                            $queryCity
                        ORDER BY rM.indications DESC
                        LIMIT 1
                ) AS label
            FROM user_indication_view uiv
                WHERE uiv.whoIndicatedId = :userId;
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * Nível do usuário + metas do nível atual e do próximo (para barra de progresso no app)
     * @param $userId
     * @param int|null $cityId
     * @return object
     */
    public function findUserLevelWithProgress($userId, ?int $cityId = null)
    {
        $level = $this->findUserLevel($userId, $cityId);
        $userIndications = (int)($level->userIndications ?? 0);
        $thresholds = $this->findLevelThresholds($userIndications, $cityId);

        return (object)[
            'userIndications' => $userIndications,
            'label' => empty($level) ? ' - ' : $level->label,
            'currentLevelIndications' => isset($thresholds->currentLevelIndications) ? (int)$thresholds->currentLevelIndications : null,
            'nextLevelIndications' => isset($thresholds->nextLevelIndications) ? (int)$thresholds->nextLevelIndications : null,
            'nextLevelLabel' => $thresholds->nextLevelLabel ?? null,
        ];
    }

    /**
     * Meta do nível atingido e do próximo nível para uma quantidade de indicações
     * @param int $indications
     * @param int|null $cityId
     * @return mixed
     */
    private function findLevelThresholds(int $indications, ?int $cityId = null)
    {
        $bind = [];
        $filters = [];

        // Parâmetros com nome único por subquery (PDO não reaproveita placeholder)
        foreach (['current', 'nextCount', 'nextLabel'] as $alias) {
            $bind[":statusId_{$alias}"] = Status::ATIVO;
            $bind[":indications_{$alias}"] = $indications;
            $filters[$alias] = " AND rM.cityId IS NULL";

            if (!empty($cityId)) {
                $filters[$alias] = " AND (rM.cityId = :cityId_{$alias} OR rM.cityId IS NULL)";
                $bind[":cityId_{$alias}"] = $cityId;
            }
        }

        $sql = /** @lang sql */ "
            SELECT
                (
                    SELECT MAX(rM.indications)
                    FROM referralMonetization rM
                    WHERE rM.statusId = :statusId_current
                      AND rM.indications <= :indications_current
                      {$filters['current']}
                ) AS currentLevelIndications,
                (
                    SELECT rM.indications
                    FROM referralMonetization rM
                    WHERE rM.statusId = :statusId_nextCount
                      AND rM.indications > :indications_nextCount
                      {$filters['nextCount']}
                    ORDER BY rM.indications ASC, rM.id ASC
                    LIMIT 1
                ) AS nextLevelIndications,
                (
                    SELECT rM.label
                    FROM referralMonetization rM
                    WHERE rM.statusId = :statusId_nextLabel
                      AND rM.indications > :indications_nextLabel
                      {$filters['nextLabel']}
                    ORDER BY rM.indications ASC, rM.id ASC
                    LIMIT 1
                ) AS nextLevelLabel;
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findTripMonetization($userId, $tripTypeId, $tripCityId)
    {
        $sql = /** @lang sql */
            "
            SELECT
                rM.label,
                rM.indications,
                rMTT.value,
                rMTT.valueType,
                rMTT.backToTripBalance
            FROM referralMonetization rM
              INNER JOIN referralMonetizationTripType rMTT on
                  (
                      rM.id = rMTT.referralMonetizationId AND
                      rMTT.statusId = 1 AND
                      rMTT.tripTypeId = :tripTypeId
                  )
                WHERE
                  rM.statusId = 1 AND
                  (rM.cityId = :tripCityId OR ISNULL(rM.cityId)) AND 
                  rM.indications <= (
                    SELECT COUNT(IF((ui.statusId = 1), 1, null)) as indications
                    FROM userIndication ui
                             INNER JOIN user u ON ui.whoIndicatedId = u.idUser
                    WHERE u.idUser = :userId
                  )
                ORDER BY 
                rM.cityId DESC,
                rM.indications DESC
                LIMIT 1
        ";

        $bind = [
            ':userId' => $userId,
            ':tripTypeId' => $tripTypeId,
            ':tripCityId' => $tripCityId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}