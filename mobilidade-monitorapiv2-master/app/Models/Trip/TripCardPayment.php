<?php

namespace App\Models\Trip;

use App\Models\Transaction\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripCardPayment extends Model
{
    protected $table = 'tripCardPayment';

    protected $primaryKey = 'idTripCardPayment';

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transactionId');
    }
}
