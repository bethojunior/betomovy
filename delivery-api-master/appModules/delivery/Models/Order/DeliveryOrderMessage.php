<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 17:39
 */

namespace Delivery\Models\Order;


use App\Models\Driver\Driver;
use App\Models\User;
use Delivery\Models\Company\Company;
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
        'type',
        'driverId',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
