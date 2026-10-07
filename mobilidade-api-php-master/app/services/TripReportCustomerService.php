<?php

namespace app\services;

use app\model\TripReport;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 10:08
 */
class TripReportCustomerService extends ReportTripService
{
    public function insert($request): TripReport
    {
        $tripReport = $this->create($request);

        $this->createLog(
            (object)[
                'tripReport' => $tripReport->toStdClass(),
            ],
            $tripReport->getTripReference(),
            "VIAGEM REPORTADA"
        );

        $this->createAdminNotificationForTripReport(
            $tripReport->getUserId(),
            $tripReport->getTripReference(),
            $tripReport->getMessage() 
        );

        return $tripReport;
    }
}