<?php


namespace App\Models\MapService;


use Illuminate\Database\Eloquent\Model;

class MapService extends Model
{
    protected $table = 'mapService';

    public function mapServiceMetaData()
    {
        return $this->hasMany(MapServiceMetaData::class, 'mapServiceId');
    }
}
