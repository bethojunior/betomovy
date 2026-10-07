<?php


namespace app\dao;

use app\utils\BaseDao;

class DynamicDao extends BaseDao
{
    public function lastDynamicsPlaces($request)
    {
        return $this->sqlRawSelect('
            select price,
                   multiplierDynamic,
                   date,
                   o.latitude,
                   o.longitude,
                   o.neighborhood
            from trip
                     inner join origin o on trip.originId = o.idOrigin
                     inner join cityArea cA on (trip.cityId = cA.cityId and cA.statusId = 1 and
                        ST_CONTAINS(cA.polygon, POINT(:latitude, :longitude)))
            where multiplierDynamic > 0
            and date_format(date, \'%Y-%m-%d\') = date_format(now(), \'%Y-%m-%d\')
            order by date desc
            ' . (isset($request->limit) && is_int($request->limit) ? ' limit ' . $request->limit : ''),
            [
                ':latitude' => $request->latitude,
                ':longitude' => $request->longitude,
            ]
        )
            ->get();
    }

    public function expensiveDynamicsPlaces($request)
    {
        return $this->sqlRawSelect("
            select price,
                   multiplierDynamic,
                   date,
                   o.latitude,
                   o.longitude,
                   o.neighborhood
            from trip
                     inner join origin o on trip.originId = o.idOrigin
                     inner join cityArea cA on (trip.cityId = cA.cityId and cA.statusId = 1 and
                        ST_CONTAINS(cA.polygon, POINT(:latitude, :longitude)))
            where multiplierDynamic > 0
            and date_format(date, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')
            order by multiplierDynamic desc
            " . (isset($request->limit) && is_int($request->limit) ? ' limit ' . $request->limit : ''),

            [
                ':latitude' => $request->latitude,
                ':longitude' => $request->longitude,
            ]
        )
            ->get();
    }

    public function placesMoreTripsDayAgo($request)
    {
        $bind = [
            ':latitude' => $request->latitude,
            ':longitude' => $request->longitude,
        ];
        $paramTimeStart = "";
        if (isset($request->timeStart)) {
            $paramTimeStart = " and date_format(date, '%H:%i:%s') >= :timeStart";
            $bind[':timeStart'] = $request->timeStart;
        }

        $paramTimeEnd = "";
        if (isset($request->timeEnd)) {
            $paramTimeEnd = " and date_format(date, '%H:%i:%s') <= :timeEnd";
            $bind[':timeEnd'] = $request->timeEnd;
        }

        return $this->sqlRawSelect("
            select o.latitude,
                   o.longitude,
                   o.neighborhood,
                   date
            from trip
                     inner join origin o on trip.originId = o.idOrigin
                     inner join cityArea cA on (trip.cityId = cA.cityId and cA.statusId = 1 and
                        ST_CONTAINS(cA.polygon, POINT(:latitude, :longitude)))
            where date_format(date, '%Y-%m-%d') = date_format(date_sub(now(), interval 1 day), '%Y-%m-%d')
            {$paramTimeStart}
            {$paramTimeEnd}
            and o.neighborhood is not null;",
            $bind
        )
            ->get();
    }

    public function placesMoreTripsWeekAgo($request)
    {
        $bind = [
            ':latitude' => $request->latitude,
            ':longitude' => $request->longitude,
        ];
        $paramTimeStart = "";
        if (isset($request->timeStart)) {
            $paramTimeStart = " and date_format(date, '%H:%i:%s') >= :timeStart";
            $bind[':timeStart'] = $request->timeStart;
        }

        $paramTimeEnd = "";
        if (isset($request->timeEnd)) {
            $paramTimeEnd = " and date_format(date, '%H:%i:%s') <= :timeEnd";
            $bind[':timeEnd'] = $request->timeEnd;
        }

        return $this->sqlRawSelect("
            select o.latitude,
                   o.longitude,
                   o.neighborhood,
                   date
            from trip
                     inner join origin o on trip.originId = o.idOrigin
                     inner join cityArea cA on (trip.cityId = cA.cityId and cA.statusId = 1 and
                        ST_CONTAINS(cA.polygon, POINT(:latitude, :longitude)))
            where date_format(date, '%Y-%m-%d') = date_format(date_sub(now(), interval 1 week), '%Y-%m-%d')
              {$paramTimeStart}
              {$paramTimeEnd}
            and o.neighborhood is not null;",
            $bind
        )
            ->get();
    }
}