<?php
/**
 * Model para externalServiceActiveChannel
 */

namespace App\Models\ExternalService;

use Illuminate\Database\Eloquent\Model;

class ExternalServiceActiveChannel extends Model
{
    protected $table = 'externalServiceActiveChannel';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'externalServiceActionId',
        'externalServiceTypeId',
        'status',
    ];

    public function externalServiceAction()
    {
        return $this->belongsTo(ExternalServiceAction::class, 'externalServiceActionId');
    }

    public function externalServiceType()
    {
        return $this->belongsTo(ExternalServiceType::class, 'externalServiceTypeId');
    }
}
