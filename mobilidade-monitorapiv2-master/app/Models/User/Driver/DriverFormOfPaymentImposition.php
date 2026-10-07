<?php


namespace App\Models\User\Driver;


use App\Models\Trip\TripPaymentForm;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverFormOfPaymentImposition extends Model
{
    use SoftDeletes;

    protected $hidden = [
        'deleted_at'
    ];

    protected $table = 'driverFormOfPaymentImposition';

    public function tripPaymentForm()
    {
        return $this->belongsTo(TripPaymentForm::class, 'tripPaymentFormId');
    }
}
