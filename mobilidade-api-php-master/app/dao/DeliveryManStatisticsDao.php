<?php


namespace app\dao;

use app\constant\DeliveryOrderStatus;
use app\utils\BaseDao;

class DeliveryManStatisticsDao extends BaseDao
{
    protected $table = "driver";

    public function find($driverId, ?string $timezone = null)
    {
        $sql = "
        SELECT (SELECT IFNULL(
                       IF((dR.deliveryServiceFeeType = '$'),
                          SUM(ROUND(deliveryOrder.deliveryFee - dR.deliveryServiceFee, 2)),
                          SUM(ROUND((deliveryOrder.deliveryFee -
                                     (deliveryOrder.deliveryFee * (dR.deliveryServiceFee / 100))),
                                    2)
                              )),
                       0)
        FROM deliveryOrder
                 INNER JOIN deliveryRate dR ON dR.id = deliveryOrder.deliveryRateId
        WHERE driverId = :driverId
          AND deliveryOrder.created_at >= :today AND deliveryOrder.created_at < DATE_ADD(:today, INTERVAL 1 DAY)) AS value_collected,
       0                                                                  AS quantity_calls,
       0                                                                  AS quantity_accepted_calls,
       0                                                                  AS quantity_refused_calls,
       0                                                                  AS quantity_canceled_calls";

        $today = today($timezone);
        $bind = [
            ':driverId' => $driverId,
            ':today' => $today
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }


    public function weeklyEarnings($driverId, $timezone = null)
    {
        $sql = "
            SELECT wd.slug,
                   dayOfWeek,
                   SUM(total_day) AS total_day
            FROM (SELECT DAYOFWEEK(dO.created_at)      as dayOfWeek,
                         IFNULL(
                                   IF((dR.deliveryServiceFeeType = '$'),
                                      SUM(ROUND(dO.deliveryFee - dR.deliveryServiceFee, 2)),
                                      SUM(ROUND((dO.deliveryFee -
                                                 (dO.deliveryFee * (dR.deliveryServiceFee / 100))),
                                                2)
                                          )),
                                   0) as total_day
            
                  FROM deliveryOrder dO
                           INNER JOIN deliveryRate dR ON dR.id = dO.deliveryRateId
                  WHERE dO.driverId = :driverId
                    AND (WEEK(dO.created_at) = WEEK(:today))
                    AND deliveryOrderStatusId = :statusFinished
                  GROUP BY DAYOFWEEK(dO.created_at)
                  UNION ALL
                  SELECT wd.day AS dayOfWeek, 0 AS day_total
                  FROM weekDay wd
                 ) weekly_earnings
                     INNER JOIN weekDay wd ON dayOfWeek = wd.day
            GROUP BY dayOfWeek
            ORDER BY dayOfWeek
        ";

        $bind = [
            ':driverId' => $driverId,
            ':statusFinished' => DeliveryOrderStatus::FINISHED,
            ':today' => today($timezone),
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

}