<?php


namespace App\Models\ExternalService;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExternalServiceGroup extends Model
{
    protected $table = 'externalServiceGroup';
    public $timestamps = false;

    public function externalServiceTypes(): BelongsToMany
    {
        return $this->belongsToMany(ExternalServiceType::class, 'externalServiceTypeGroup', 'externalServiceGroupId', 'externalServiceTypeId');
    }
}
