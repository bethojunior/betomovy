<?php


namespace App\Models\MapService;


use Illuminate\Database\Eloquent\Model;

class MapServiceMetaData extends Model
{
    protected $table = 'mapServiceMetaData';

    public function mapService()
    {
        return $this->belongsTo(MapService::class, 'mapServiceId');
    }

    public function MapServiceMetaDatasCity()
    {
        return $this->hasMany(MapServiceMetaDataCity::class, 'mapServiceMetaDataId');
    }
}
