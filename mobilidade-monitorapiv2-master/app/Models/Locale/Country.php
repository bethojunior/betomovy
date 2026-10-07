<?php

namespace App\Models\Locale;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'country';
    protected $fillable = [
        'name',
        'shortName'
    ];
    public $timestamps = false;
}
