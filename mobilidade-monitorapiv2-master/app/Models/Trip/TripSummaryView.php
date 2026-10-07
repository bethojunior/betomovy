<?php

namespace App\Models\Trip;

use App\Models\Central\Price;
use App\Models\Trip\Toll\Toll;
use App\Models\User\Customer;
use App\Models\User\Driver;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class TripSummaryView extends Model
{
    protected $table = 'trip_summary_view';

    protected $dates = [
        'date', 'endDate'
    ];

    protected $primaryKey = 'idTrip';

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'userId', 'userId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    public function driversCalled()
    {
        return $this->hasMany(DriverCalled::class, 'tripReference', 'tripReference');
    }

    public function driverCommission()
    {
        return $this->belongsTo(
            DriverCommission::class,
            'driverCommissionId',
            null,
            'driverCommission');
    }

    public function tripWayPoints()
    {
        return $this->hasMany(
            TripWayPoint::class, 'tripReference', 'tripReference');
    }

    public function fare()
    {
        return $this->belongsTo(Price::class, 'priceId');
    }

    public function recalculatedTrip()
    {
        return $this->hasOne(RecalculatedTrip::class, 'tripReference', 'tripReference');
    }

    public function tripLongDistance()
    {
        return $this->hasOne(TripLongDistanceValue::class, 'tripId');
    }

    public function rewardCampaignTrip()
    {
        return $this->hasMany(RewardCampaignTrip::class, 'tripReference', 'tripReference');
    }

    public function rewardTripLongDistance()
    {
        return $this->hasOne(RewardTrip::class, 'tripReference', 'tripReference');
    }

    public function tolls()
    {
        return $this
            ->belongsToMany(
                Toll::class,
                'tollTrip',
                'tripId',
                'tollId');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
