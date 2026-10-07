<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 13:53
 */

namespace App\Models\User\Driver;


use App\Models\Trip\TripPaymentForm;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverFormOfPayment extends Model
{
    use SoftDeletes;

    protected $table = 'driverFormOfPayment';

    public function tripPaymentForm()
    {
        return $this->belongsTo(TripPaymentForm::class, 'tripPaymentFormId');
    }
}
