<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/06/2019
 * Time: 09:32
 */

namespace App\Constants\Central;


class CentralCustomerConst
{
    const ACTIONS = [
        'block', 'release'
    ];

    const BLOCK_ACTION = 'block';
    const RELEASE_ACTION = 'release';

    const STATUS_BLOCKED = 3;
    const STATUS_ACTIVE = 1;
}
