<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 10:38
 */

namespace Common\Models\Order;


use Illuminate\Database\Eloquent\Model;

class DeliveryOrderComplement extends Model
{
    protected $table = 'deliveryOrderComplement';

    protected $fillable = [
        'quantity',
        'deliveryComplementId'
    ];

    public function deliveryComplement()
    {
        return $this->belongsTo(DeliveryComplement::class, 'deliveryComplementId');
    }
}
