<?php

namespace App\Models\Trip;

use App\Models\Config\PaymentFormType;
use Illuminate\Database\Eloquent\Model;

class TripPaymentForm extends Model
{

    public const UPDATED_AT = null;
    public const CREATED_AT = null;

    protected $table = 'tripPaymentForm';

    protected $primaryKey = 'idTripPaymentForm';

    protected $hidden = ["statusId"];
    protected $active = null;

    protected $fillable = ["name","paymentFormTypeId"];

    public function paymentFormType()
    {
        return $this->belongsTo(PaymentFormType::class,'paymentFormTypeId');
    }
}
