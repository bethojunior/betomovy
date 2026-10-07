<?php


namespace App\Models\CallGroup;

use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class CallGroupsTripTypeLinked extends Model
{
    protected $table = 'callGroupsTripTypeLinked';

    protected $primaryKey = 'id';

    protected $fillable = [
        'tripTypeId',
        'call_group_id',
    ];

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId', 'idTripType');
    }

    public function callGroups()
    {
        return $this->belongsTo(CallGroup::class, 'call_group_id', 'id');
    }
}
