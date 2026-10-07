<?php


namespace App\Models\Establishment;


use App\Models\Company\Company;
use App\Models\Config\StatusPayment;
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

    public function company()
    {
        return $this->belongsTo(Company::class, "companyId", "id");
    }
}
