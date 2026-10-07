<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/08/2020
 * Time: 13:59
 */

namespace Common\Models\Config;


use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryOrderConfig extends Model
{
    protected $table = 'companyDeliveryOrderConfig';

    protected $fillable = [
        "companyId",
        "minimumOrderValue",
        "callForAll",
        "averageDeliveryTime"
    ];
}
