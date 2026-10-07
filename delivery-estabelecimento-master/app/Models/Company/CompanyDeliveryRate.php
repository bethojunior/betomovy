<?php


namespace App\Models\Company;


use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryRate extends Model
{

    protected $table = "companyDeliveryRate";

    protected $fillable = [
        'range',
        'tax',
        'time',
        'companyId',
    ];
}
