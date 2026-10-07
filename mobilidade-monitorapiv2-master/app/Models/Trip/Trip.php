<?php

namespace App\Models\Trip;

use App\Models\Central\CentralCustomer;
use App\Models\Central\Price;
use App\Models\Trip\Ride\Ride;
use App\Models\Trip\Toll\Toll;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Models\Locale\City;
use App\Utils\UUID;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Trip extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->attributes['tripReference'] = $attributes['tripReference'] ?? UUID::v4();
    }

    const UPDATED_AT = null;

    const CREATED_AT = 'date';

    protected $table = 'trip';

    protected $primaryKey = 'idTrip';

    protected $fillable = [
        "cityId",
        "tripTypeId",
        "priceId",
        "price",
        "tripPaymentFormId",
        "centralId"
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function origin()
    {
        return $this->belongsTo(Origin::class, 'originId');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destinationId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    public function centralCustomer()
    {
        return $this->belongsTo(
            CentralCustomer::class, 'centralCustomerId', null, 'customer');
    }

    public function driverCommission()
    {
        return $this->belongsTo(
            DriverCommission::class,
            'driverCommissionId',
            null,
            'driverCommission');
    }

    public function partnerCommission(): BelongsTo
    {
        return $this->belongsTo(PartnerCommission::class, 'partnerCommissionId');
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zoneId');
    }

    public function tripWayPoints()
    {
        return $this->hasMany(
            TripWayPoint::class, 'tripReference', 'tripReference');
    }

    public function tripPaymentForm()
    {
        return $this->belongsTo(TripPaymentForm::class, 'tripPaymentFormId');
    }

    public function tripHistory()
    {
        return $this->hasMany(TripHistory::class, 'tripReference', 'tripReference');
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
        return $this->hasOne(TripLongDistanceValue::class, 'tripId')
            ->join('trip', 'trip.idTrip', '=', 'tripLongDistanceValue.tripId')
            ->whereColumn('tripLongDistanceValue.driverId', 'trip.driverId')
            ->select('tripLongDistanceValue.*');
    }

    public function rewardCampaignTrip()
    {
        return $this->hasMany(RewardCampaignTrip::class, 'tripReference', 'tripReference');
    }

    public function rewardTripLongDistance()
    {
        return $this->hasOne(RewardTrip::class, 'tripReference', 'tripReference')
            ->join('trip', 'trip.tripReference', '=', 'rewardTrip.tripReference')
            ->whereColumn('rewardTrip.driverId', 'trip.driverId')
            ->select('rewardTrip.*');
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

    public function driverCalled()
    {
        return $this->hasMany(DriverCalled::class, "tripReference", "tripReference");
    }

    public function taxes(): BelongsToMany
    {
        return $this->belongsToMany(Tax::class, 'tripTax', 'tripId', 'taxId', 'idTrip');
    }

    public function ride(): HasOne
    {
        return $this->hasOne(Ride::class, 'tripReference', 'tripReference');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId', 'id');
    }

}
