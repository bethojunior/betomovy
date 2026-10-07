<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 18:11
 */

namespace Common\Models\Order;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryProduct extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryProduct';

    protected $fillable = [
        'position'
    ];
}
