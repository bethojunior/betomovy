<?php

namespace App\Models\Locale;

use App\Models\Config\CityArea;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = 'city';

    protected $hidden = ['statusId'];
    protected $fillable = [
        'nome',
        'shortName',
        'estado',
        'statusId'
    ];
    public $timestamps = false;

    public function cityArea()
    {
        return $this->hasOne(CityArea::class, 'cityId');
    }

    public function state()
    {
        return $this->belongsTo(Estate::class, 'estado');
    }

}
