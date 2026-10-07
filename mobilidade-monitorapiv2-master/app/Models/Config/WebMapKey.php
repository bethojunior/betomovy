<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WebMapKey extends Model
{
    use SoftDeletes;
    protected $table = "webMapKey";
    protected $fillable = [
        'key'
    ];
}
