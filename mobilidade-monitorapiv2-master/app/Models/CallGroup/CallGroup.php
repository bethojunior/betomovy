<?php


namespace App\Models\CallGroup;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class CallGroup extends Model
{
    protected $table = 'call_group';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'image',
        "weight",
    ];

    public function callGroups()
    {
        return $this->belongsTo(Driver::class, 'call_group_id');
    }
}
