<?php

namespace App\Models\Trip;

use App\Realtimes\Trip\Trip;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripEventsDetails extends Model
{
  protected $table = 'tripEventsDetails';

  protected $fillable = [
    "tripReference",
    "type",
    "data"
  ];

  public function trip(): BelongsTo
  {
    return $this->belongsTo(Trip::class, 'tripReference', 'tripReference');
  }
}
