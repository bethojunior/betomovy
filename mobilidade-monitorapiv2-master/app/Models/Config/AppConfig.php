<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppConfig extends Model
{
    use SoftDeletes;

    protected $table = 'appConfig';

    protected $fillable = [
        "mainColor",
        "mainColorText",
        "secondaryColor",
        "secondaryColorText",
        "logo",
        "appId",
        "name"
    ];
}
