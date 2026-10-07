<?php


namespace App\Models\Company;


use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryArea extends Model
{
    protected $table = "companyDeliveryArea";

    protected $fillable = [
        'area',
        'companyId'
    ];
}
