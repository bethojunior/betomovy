<?php
/**
 * Created by PhpStorm.
 * User: Betho Junior
 * Date: 12/09/2025
 * Time: 10:44
 */

namespace App\Repositories\Trip;

use Illuminate\Support\Facades\DB;

class HoursWaitedRepository
{
    public function handle(array $filters = [])
    {
        $query = DB::table('trip as t')
            ->join('waitingHoursDrivers as whd', 't.tripReference', '=', 'whd.tripReference')
            ->join('driver as d', 'd.idDriver', '=', 't.driverId')
            ->join('user as u', 'u.idUser', '=', 'd.userId')
            ->join('city as c', 'c.id', '=', 't.cityId')
            ->select(
                'whd.timeInSeconds',
                'u.name',
                'u.nickname',
                'u.document',
                'u.phone',
                'u.email',
                'c.nome as city_name'
            );

        if (!empty($filters['driverId'])) {
            $query->where('d.idDriver', $filters['driverId']);
        }

        if (!empty($filters['dateStart'])) {
            $query->where('t.created_at', '>=', $filters['dateStart']);
        }

        if (!empty($filters['dateEnd'])) {
            $query->where('t.created_at', '<=', $filters['dateEnd']);
        }

        if (!empty($filters['cityId'])) {
            $query->where('t.cityId', $filters['cityId']);
        }

        return $query->get();
    }
}
