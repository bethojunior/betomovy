<?php

namespace App\Models\Trip;

use App\Models\User\Driver;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class TripCancellationCustomerFee extends Model
{
    protected $table = 'tripCancellationCustomerFee';

    public function tripCancellationFeeType()
    {
        return $this->belongsTo(
            TripCancellationFeeType::class, 'tripCancellationFeeTypeId');
    }

    public function trip()
    {
        return $this->belongsTo(TripSummaryView::class, 'tripReference', 'tripReference');
    }

    public function paidByTrip()
    {
        return $this->belongsTo(TripSummaryView::class, 'tripReference', 'tripReference');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
