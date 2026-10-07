<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:22
 */

namespace App\Models\ExternalService;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExternalServiceType extends Model
{
    protected $table = 'externalServiceType';
    public $timestamps = false;

    public function externalServiceGroups(): BelongsToMany
    {
        return $this->belongsToMany(ExternalServiceGroup::class, 'externalServiceTypeGroup', 'externalServiceTypeId', 'externalServiceGroupId');
    }

    public function externalServices()
    {
        return $this->hasMany(ExternalService::class, 'externalServiceTypeId');
    }
}
