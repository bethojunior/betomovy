<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class CorporateRouteCustomer extends Model
{
    protected $table = "corporateRouteCustomer";

    protected $fillable = [
        "name",
        "document",
        "address",
        "latitude",
        "longitude",
        "companyId",
        "phone"
    ];
}
