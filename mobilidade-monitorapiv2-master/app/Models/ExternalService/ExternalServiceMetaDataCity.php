<?php


namespace App\Models\ExternalService;


use Illuminate\Database\Eloquent\Model;

class ExternalServiceMetaDataCity extends Model
{
    protected $table = 'externalServiceMetaDataCity';
    public const UPDATED_AT = null;

    protected $fillable = [
        'externalServiceMetaDataId',
        'value',
        'cityId'
    ];
}
