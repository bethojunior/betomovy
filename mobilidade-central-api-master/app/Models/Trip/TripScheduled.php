<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class TripScheduled extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    protected $table = 'tripScheduled';
    protected $primaryKey = 'id';

    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $hidden = [
        'id',
        'created_at',
        'statusId'
    ];

    protected $fillable = [
        'tripReference',
        'schedule',
        'scheduleUTC'
    ];
}
