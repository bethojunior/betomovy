<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class ScheduleCorporateRouteCustomer extends Model
{
    protected $table = "scheduleCorporateRouteCustomer";

    protected $fillable = [
        "corporateRouteCustomerId",
        "scheduleCorporateRouteId"
    ];

    public function corporateRouteCustomer()
    {
        return $this->belongsTo(CorporateRouteCustomer::class, "corporateRouteCustomerId");
    }
}
