<?php

namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model AS Document;

class Log extends Document
{
    const CREATED_AT = 'registered_at';

    const UPDATED_AT = null;

    protected $collection = 'logs';

    protected $connection = 'mongodb';

    protected $fillable = [
        'data', 'idReference', 'userId', 'app', 'message', 'date'
    ];

    protected $dates = [
        'registered_at',
    ];
}
