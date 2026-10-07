<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/01/2020
 * Time: 15:50
 */

namespace App\Constants\Users;


class DriverRegisterStatusConst
{
    const ACTIVE = 1;
    const PENDING = 2;
    const BLOCKED = 3;
    const WAITING_ANSWER = 4;
    const BLACKLIST = 5;
}
