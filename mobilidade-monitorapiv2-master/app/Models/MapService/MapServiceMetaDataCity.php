<?php


namespace App\Models\MapService;


use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Model;

class MapServiceMetaDataCity extends Model
{
    protected $table = 'mapServiceMetaDataCity';
    const UPDATED_AT = null;
    protected $fillable = [
        'mapServiceMetaDataId',
        'value',
        'cityId',
        'statusId',
        'groupCode'
    ];

    public function mapServiceMetaData()
    {
        return $this->belongsTo(MapServiceMetaData::class, 'mapServiceMetaDataId');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
