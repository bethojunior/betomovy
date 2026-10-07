<?php


namespace Delivery\Models\Delivery;


use Illuminate\Database\Eloquent\Model;

class PayMachineReturn extends Model
{
    protected $table = "payMachineReturn";

    protected $fillable = [
        "value",
        "payMachineReturnTypeId",
        "cityId"
    ];

    const UPDATED_AT = null;
}
