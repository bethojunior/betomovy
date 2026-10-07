<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2020
 * Time: 11:41
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
