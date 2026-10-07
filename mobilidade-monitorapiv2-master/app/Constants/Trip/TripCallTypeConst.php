<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 22:21
 */

namespace App\Constants\Trip;


class TripCallTypeConst
{
    const NORMAL_CALL = 1;
    const KNOB_TRIP = 2;
    const PARTNER_CALL = 3;
    const CENTRAL_CALL = 4;

    const TRIP_CALL_TYPE = [
        ['id' => self::NORMAL_CALL, 'text' => 'App'],
        ['id' => self::CENTRAL_CALL, 'text' => 'Central'],
    ];
}
