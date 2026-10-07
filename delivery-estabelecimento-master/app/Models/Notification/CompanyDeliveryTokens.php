<?php

namespace App\Models\Notification;

use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryTokens extends Model
{
    protected $table = "companyDeliveryTokens";

    protected $fillable = [
       "token",
        "companyId"
    ];

}
