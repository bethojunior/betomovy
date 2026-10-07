<?php

namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model as Document;
class QueueInsert extends Document
{
    protected $collection = 'queue_inserts';

    protected $connection = 'mongodb';
}
