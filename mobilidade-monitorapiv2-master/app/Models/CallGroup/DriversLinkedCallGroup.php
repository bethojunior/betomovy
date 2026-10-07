<?php


namespace App\Models\CallGroup;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class DriversLinkedCallGroup extends Model
{
    protected $table = 'driversLinkedCallGroup';

    protected $primaryKey = 'id';

    protected $fillable = [
        'driverId',
        'call_group_id'
    ];

    public function callGroups()
    {
        return $this->belongsTo(CallGroup::class, 'call_group_id', 'id');
    }

    public function drivers()
    {
        return $this->belongsTo(Driver::class, 'driverId', 'idDriver');
    }
}
