<?php

namespace App\Audit;

use Illuminate\Database\Eloquent\Model;

class InternalAudit extends Model
{
    protected $fillable = [
        'userId',
        'localizationLog',
        'browser',
        'url_path',
        'method',
        'ip',
        'content',
        'message',

    ];

    protected $table = 'internalAudit';

    const UPDATED_AT = null;
}
