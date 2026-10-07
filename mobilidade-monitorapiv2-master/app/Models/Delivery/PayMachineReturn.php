<?php


namespace App\Models\Delivery;


use Illuminate\Database\Eloquent\Model;

class PayMachineReturn extends Model
{
    protected $table = "payMachineReturn";

    protected $fillable = [
        "value",
        "payMachineReturnTypeId",
        "cityId",
        "paidByPlatform"
    ];

    const UPDATED_AT = null;
}
