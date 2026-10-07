<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 16:20
 */

namespace App\Constants\Trip;


class TripConst
{
    const CANCELED_BY_CUSTOMER = 'customer';
    const CANCELED_BY_DRIVER = 'driver';
    const CANCELED_BY_ADMIN = 'admin';

    /**
     * OFF STATUSES
     */
    const CANCELED = 'canceled';
    const NOT_ANSWERED = 'not_answered';
    const FINISHED = 'finished';
    const BACK_OFF = 'back_off';
    const PAYMENT_REFUSED = 'payment_refused';

    /**
     * ACTIVES STATUSES
     */
    const PRE_ACCEPTED = 'pre_accepted';
    const ACCEPTED = 'accepted';
    const SCHEDULED = 'scheduled';

    const BOARDING = 'boarding';
    const IN_PROGRESS = 'in_progress';

    const ACTIVE_STATUSES = [
        'accepted',
        'pre_accepted',
        'in_progress',
        'boarding',
    ];

    const STATUSES = [
        'canceled',
        'not_answered',
        'finished',
        'back_off',
        'payment_refused',
        'in_progress',
        'accepted',
        'pre_accepted',
        'searching',
        'searching_favorite',
        'boarding',
        'scheduled',
    ];
}
