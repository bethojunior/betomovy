<?php


namespace App\Constants\Trip;


class TripAuditConst
{
    const RELEASED = 1;
    const IN_ANALYSIS = 2;
    const BLOCKED = 3;
    const RELEASED_AFTER_ANALYSIS = 4;

    const AUTOMATICALLY_RELEASED = 6;

    const CLOSE_DISTANCE = 150;
    const MEDIUM_DISTANCE = 200;
}
