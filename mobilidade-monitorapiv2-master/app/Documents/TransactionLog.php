<?php

namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model as Document;

class TransactionLog extends Document
{
    const CREATED_AT = 'created_at';

    const UPDATED_AT = null;

    protected $collection = 'transactions_logs';

    protected $connection = 'mongodb';

    protected $fillable = [
        'data', 'idReference', 'userId',
    ];
}
