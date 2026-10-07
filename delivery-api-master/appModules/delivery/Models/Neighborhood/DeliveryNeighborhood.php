<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:35
 */

namespace Delivery\Models\Neighborhood;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryNeighborhood';

    protected $hidden = [
        'deleted_at'
    ];
}
