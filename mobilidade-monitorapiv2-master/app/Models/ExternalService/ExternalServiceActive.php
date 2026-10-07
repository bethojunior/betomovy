<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:54
 */

namespace App\Models\ExternalService;


use Illuminate\Database\Eloquent\Model;

class ExternalServiceActive extends Model
{
    const UPDATED_AT = null;

    protected $table = 'externalServiceActive';

    public function externalServiceAction()
    {
        return $this->belongsTo(ExternalServiceAction::class, 'externalServiceActionId');
    }

    public function externalServiceType()
    {
        return $this->belongsTo(ExternalServiceType::class, 'externalServiceTypeId');
    }
}
