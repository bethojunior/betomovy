<?php


namespace App\Models\ExternalService;


use App\Constants\Config\ExternalServiceMetaDataConst;
use Illuminate\Database\Eloquent\Model;

class ExternalServiceMetadata extends Model
{
    protected $table = 'externalServiceMetaData';
    public $timestamps = null;

    public function getValueAttribute()
    {
        if (in_array($this->attributes['value'], [
            ExternalServiceMetaDataConst::DEFAULT_ZENVIA_KEY,
            ExternalServiceMetaDataConst::DEFAULT_ZENVIA_BKP_KEY
        ]))
            return null;

        return $this->attributes['value'];
    }

    public function externalService()
    {
        return $this->belongsTo(ExternalService::class, 'externalServiceId');
    }
}
