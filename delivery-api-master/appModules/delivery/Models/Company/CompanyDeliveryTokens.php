<?php


namespace Delivery\Models\Company;


use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryTokens extends Model
{
    protected $table = "companyDeliveryTokens";

    protected $fillable = [
        "token",
        "companyId"
    ];

}
