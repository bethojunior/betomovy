<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 10:40
 */

namespace Common\Models\Order;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryGroupComplement extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryGroupComplement';

    protected $hidden = [
        'deleted_at'
    ];
}
