<?php

namespace app\dao;

use app\constant\DriverCalledConst;
use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/01/2019
 * Time: 16:45
 */
class DriverStatisticsDao extends BaseDao
{
    protected $table = "driver";

    public function find($driverId, ?string $timezone = null)
    {
        $sql = /** @lang sql */
            "
            SELECT
              FORMAT(IFNULL(earnings.collected, 0), 2, 'de_DE') AS value_collected,
              (counts.total_today + refused.refused_today)      AS quantity_calls,
              counts.accepted_today                             AS quantity_accepted_calls,
              refused.refused_today                             AS quantity_refused_calls,
              counts.canceled_today                             AS quantity_canceled_calls,
              earnings.finished_today                           AS quantity_finished_calls
            FROM
              (
                SELECT
                  (
                    ROUND(
                      SUM(
                        CASE
                            WHEN dC.disableOnPromotion = 1 AND rct.id IS NOT NULL THEN ts.price
                            WHEN (dC.valueType = '$') THEN
                                    round(
                                ts.price - ifnull(bfof.value, dC.value) - ifnull(bfpf.value, 0) - ifnull(taxes.value, 0),
                                2
                              )
                            ELSE
                              round(
                                ts.price - ifnull(
                                  bfof.value,
                                  ts.price * (dC.value / 100)
                                ) - ifnull(bfpf.value, 0) - ifnull(taxes.value, 0),
                                2
                              )
                        END
                      ),
                      2
                    ) + IFNULL(
                      SUM(rt.value),
                      0
                    ) + IFNULL(
                      SUM(rct.value),
                      0
                    )
                  ) AS collected,
                  COUNT(ts.idTrip) AS finished_today
                FROM
                  trip ts
                  LEFT JOIN rewardTrip rt ON ts.rewardTripId = rt.id
                  LEFT JOIN rewardCampaignTrip rct ON ts.tripReference = rct.tripReference
                  LEFT JOIN driverCommission dC ON ts.driverCommissionId = dC.idDriverCommission
                  left join `balanceFlow` as `bfpf` on `bfpf`.`balanceFlowTypeId` = 43
                  and `bfpf`.`tripReference` = ts.`tripReference`
                  left join `balanceFlow` as `bfof` on `bfof`.`balanceFlowTypeId` = 8
                  and `bfof`.`tripReference` = ts.`tripReference`
                  left join (
                    select
                      tripReference,
                      sum(
                        round(balanceFlow.value, 2)
                      ) as value
                    from
                      `balanceFlow`
                    where
                      balanceFlowTypeId = 92
                    group by
                      tripReference
                  ) as taxes on taxes.tripReference = ts.tripReference
                WHERE
                  ts.driverId = :driverId
                  AND ts.status = :statusFinished
                  AND ts.date >= :today AND ts.date < DATE_ADD(:today, INTERVAL 1 DAY)
              ) earnings,
              (
                SELECT
                  COUNT(*) AS total_today,
                  IFNULL(SUM(CASE WHEN status IN ('finished', 'canceled') THEN 1 ELSE 0 END), 0) AS accepted_today,
                  IFNULL(SUM(CASE WHEN canceledBy = 'driver' THEN 1 ELSE 0 END), 0) AS canceled_today
                FROM
                  trip
                WHERE
                  driverId = :driverId
                  AND date >= :today AND date < DATE_ADD(:today, INTERVAL 1 DAY)
              ) counts,
              (
                SELECT
                  COUNT(*) AS refused_today
                FROM
                  driverCalled
                WHERE
                  driverId = :driverId
                  AND status = :statusRefused
                  AND updated_at >= :today AND updated_at < DATE_ADD(:today, INTERVAL 1 DAY)
              ) refused
        ";

        $today = today($timezone);

        $bind = [
            ':driverId' => $driverId,
            ':today' => $today,
            ':statusFinished' => Trip::FINISHED,
            ':statusRefused' => DriverCalledConst::REFUSED,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function weeklyEarnings($driverId, $timezone = null)
    {
        $sql = /** @lang sql */
            "
            SELECT wd.slug,
                   dayOfWeek,
                   SUM(total_day) AS total_day
            FROM (
                     SELECT DAYOFWEEK(ts.date) as dayOfWeek,
                            ROUND(
                                        IF((dC.valueType = '$'),
                                           SUM(round((ts.price - ifnull(bfof.value, dC.value) - ifnull(bfpf.value, 0) -
                                                      ifnull(taxes.value, 0)), 2)),
                                           SUM(round((ts.price - ifnull(bfof.value, ts.price * (dC.value / 100)) -
                                                      ifnull(bfpf.value, 0) - ifnull(taxes.value, 0)), 2))) +
                                        IFNULL(SUM(rt.value), 0) +
                                        IFNULL(SUM(rct.value), 0)
                                , 2)           as total_day
                     FROM trip ts
                              LEFT JOIN rewardTrip rt ON ts.rewardTripId = rt.id
                              LEFT JOIN rewardCampaignTrip rct ON ts.tripReference = rct.tripReference
                              LEFT JOIN driverCommission dC on ts.driverCommissionId = dC.idDriverCommission
                              left join `balanceFlow` as `bfpf`
                                        on `bfpf`.`balanceFlowTypeId` = 43 and `bfpf`.`tripReference` = ts.`tripReference`
                              left join `balanceFlow` as `bfof`
                                        on `bfof`.`balanceFlowTypeId` = 8 and `bfof`.`tripReference` = ts.`tripReference`
                              left join (select tripReference,
                                                sum(round(balanceFlow.value, 2)) as value
                                         from `balanceFlow`
                                         where balanceFlowTypeId = 92
                                         group by tripReference) as taxes on taxes.tripReference = ts.tripReference                     
                     WHERE ts.driverId = :driverId
                       AND ts.status = :statusFinished
                       AND (WEEK(ts.date) = WEEK(:today))
                       AND (YEAR(ts.date) = YEAR(:today))
                     GROUP BY DAYOFWEEK(ts.date)
                     UNION ALL
                     SELECT wd.day AS dayOfWeek, 0 AS day_total
                     FROM weekDay wd
                 ) weekly_earnings
                     INNER JOIN weekDay wd ON dayOfWeek = wd.day
            GROUP BY dayOfWeek
            ORDER BY dayOfWeek;
        ";

        $bind = [
            ':driverId' => $driverId,
            ':statusFinished' => Trip::FINISHED,
            ':today' => today($timezone),
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}