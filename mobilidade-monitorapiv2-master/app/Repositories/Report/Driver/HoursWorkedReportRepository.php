<?php

/**
 * Created by PhpStorm.
 * User: BJR
 * Date: 02/09/2025
 * Time: 14:37
 */

namespace App\Repositories\Report\Driver;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HoursWorkedReportRepository
{
    public function handle(array $request = [], $userRole = null)
    {
        $query = DB::table('driver')
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->join('hours_worked_driver', 'hours_worked_driver.driverId', '=', 'driver.idDriver')
            ->leftJoin('limit_hours_worked', function ($join) {
                $join->on('limit_hours_worked.driverId', '=', 'driver.idDriver')
                     ->on('limit_hours_worked.date', '=', 'hours_worked_driver.date');
            })
            ->select([
                'user.name as driver_name',
                'user.document as driver_document',
                'user.email as driver_email',
                'user.phone as driver_phone',
                'hours_worked_driver.hours as hours_worked',
                'hours_worked_driver.date as date',
                'limit_hours_worked.hours as max_hours'
            ]);

        if (isset($request['start_date'])) {
            $query->whereDate('hours_worked_driver.date', '>=', $request['start_date']);
        }

        if (isset($request['end_date'])) {
            $query->whereDate('hours_worked_driver.date', '<=', $request['end_date']);
        }

        if (isset($request['driver_id'])) {
            $query->where('driver.idDriver', $request['driver_id']);
        }

        $query->orderBy('hours_worked_driver.date', 'desc');

        return $query->get()->map(function ($item) {

            $hoursWorkedminutes = $item->hours_worked;
            $hours = floor($hoursWorkedminutes / 60);
            $remainingMinutes = $hoursWorkedminutes % 60;

            $formatted = "{$hours}h {$remainingMinutes}min";
            return (object) [
                'driver_name' => $item->driver_name,
                'driver_document' => $item->driver_document,
                'driver_email' => $item->driver_email,
                'driver_phone' => $item->driver_phone,
                'hours_worked' => $formatted,
                'max_hours' => $item->max_hours ? round($item->max_hours / 60, 2) : 'Sem limite',
                'date' => Carbon::parse($item->date),
                'status' => $this->getHoursStatus($formatted, $item->max_hours)
            ];
        });


        // return $query->get()->map(function ($item) {
        //     $hoursWorked = round($item->hours_worked / 60, 2);
        //     $maxHours = $item->max_hours ? round($item->max_hours / 60, 2) : null;

        //     return (object) [
        //         'driver_name' => $item->driver_name,
        //         'driver_document' => $item->driver_document,
        //         'driver_email' => $item->driver_email,
        //         'driver_phone' => $item->driver_phone,
        //         'hours_worked' => $hoursWorked,
        //         // 'max_hours' => $maxHours ?? 'Sem limite',
        //         'max_hours' => $item->max_hours ? round($item->max_hours / 60, 2) : 'Sem limite',
        //         'date' => Carbon::parse($item->date),
        //         'status' => $this->getHoursStatus($hoursWorked, $maxHours)
        //     ];
        // });

    }

    private function getHoursStatus($hoursWorkedMinutes, $maxHoursMinutes)
    {
        if (!$maxHoursMinutes) {
            return 'Sem limite definido';
        }

        if ($hoursWorkedMinutes > $maxHoursMinutes) {
            return 'Excedeu limite';
        } elseif ($hoursWorkedMinutes == $maxHoursMinutes) {
            return 'No limite';
        } else {
            return 'Dentro do limite';
        }
    }
}
