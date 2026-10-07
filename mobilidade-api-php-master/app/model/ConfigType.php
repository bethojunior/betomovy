<?php

namespace app\model;

use app\utils\BaseModel;

class ConfigType extends BaseModel
{
    const ESTABLISHMENT = 1;
    const DRIVER = 2;
    const TRIP = 3;
    const SUPPORT = 4;
    const CUSTOMER_PARTNER = 5;
    const CUSTOMER = 6;
    const BLACKLIST = 7;
    const RATING = 8;
}