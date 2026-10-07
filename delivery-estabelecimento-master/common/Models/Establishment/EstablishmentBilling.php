<?php


namespace Common\Models\Establishment;


use Common\Models\Config\StatusPayment;
use Illuminate\Database\Eloquent\Model;

class EstablishmentBilling extends Model
{
    protected $table = "establishmentBilling";

    protected $fillable = [
        'companyId',
        'value',
        'statusPaymentId',
        'description'
    ];

    public function statusPayment()
    {
        return $this->belongsTo(StatusPayment::class, "statusPaymentId", "id");
    }
}
