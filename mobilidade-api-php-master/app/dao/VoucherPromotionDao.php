<?php


namespace app\dao;

use app\utils\BaseDao;

class VoucherPromotionDao extends BaseDao
{
    protected $table = "voucherPromotion";

    public function findAll($request)
    {
        return $this->sqlRawSelect(/** @lang sql */ '
                SELECT id,
                       amount,
                       value,
                       percentage,
                       cityId,
                       user
                FROM voucherPromotion vP 
                WHERE statusId = 1
                  AND cityId = (
                    SELECT cityId
                    from cityArea cA
                    where statusId = 1
                      and ST_CONTAINS(cA.polygon, POINT(:latitude, :longitude))
                    limit 1
                )
                AND vP.user LIKE :user
                ORDER BY vP.amount ASC;
            ', [
            ':latitude' => $request->latitude,
            ':longitude' => $request->longitude,
            ':user' => $request->user ?? 'client',
        ])
            ->get();
    }
}