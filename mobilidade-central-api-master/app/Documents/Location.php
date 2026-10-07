<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 16:37
 */

namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model AS Document;

class Location extends Document
{
    const CREATED_AT = 'registered_at';

    protected $collection = 'locations';

    protected $connection = 'mongodb';

    protected $dates = [
        'registered_at',
    ];
}
