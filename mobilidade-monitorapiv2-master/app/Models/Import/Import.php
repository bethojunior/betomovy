<?php

namespace App\Models\Import;

use Illuminate\Database\Eloquent\Model;

class Import extends Model
{
    protected $table = 'import';

    protected $fillable = [
        'importTypeId',
        'status',
        'failedRow',
        'successRow',
    ];
}
