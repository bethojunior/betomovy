<?php


namespace App\Models\ExternalService;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExternalService extends Model
{
    protected $table = 'externalService';
    public $timestamps = null;
    protected $fillable = [
        'name',
        'externalServiceTypeId',
        'active',
        'frontEndConfigurable'
    ];

    public function externalServiceMetaData(): HasMany
    {
        return $this->hasMany(ExternalServiceMetadata::class, 'externalServiceId', 'id');
    }
}
