<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class CityConfigView extends Model
{
    protected $table = 'city_config_view';

    public function getValueAttribute()
    {
        return $this->mapper($this['attribute'], $this->attributes['value']);
    }

    private function mapper($key, $value)
    {
        switch ($key) {
            case 'enabledDriverFields':
                return $value ?
                    json_decode($value) : null;
            default:
                return $value;
        }
    }
}
