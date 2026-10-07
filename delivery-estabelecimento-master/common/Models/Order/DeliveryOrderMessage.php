<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 15:43
 */

namespace Common\Models\Order;


use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrderMessage extends Model
{
    protected $table = 'deliveryOrderMessage';

    protected $fillable = [
        'deliveryOrderId',
        'userId',
        'companyId',
        'companyWorkerId',
        'message',
        'isAudio',
        'type'
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
