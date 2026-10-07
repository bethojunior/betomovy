<?php

namespace App\Constants\Push;

class PushConst
{
    const HIGH_PRIORITY = 2;
    const FORCE_START = 1;

    const OPEN_APP_ACTION = 'openApp';
    const RIDE_REQUEST_TAG = 'rideRequest';
    const TRIP_CALL_CATEGORY_ID = 'tripCall';

    const TRIP_CALL_ICON = null;
    const TRIP_CALL_SOUND = 'assobio.mp3';
    const TRIP_CALL_FALLBACK_MESSAGE = 'Facilitador de chamadas ativo, mantenha o app aberto!';
}
