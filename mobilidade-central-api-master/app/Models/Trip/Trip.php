<?php

namespace App\Models\Trip;

use App\Models\Central\CentralCustomer;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Utils\UUID;
use Illuminate\Database\Eloquent\Model;

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
        "centralId",
        "distance",
        "estimatedTripTime",
        "multiplierDynamic",
        "favoriteDrivers",
        "haveReturn",
        "centralNeighborhoodId",
        "aditionalInfo",
        "flow",
        "centralCustomerId",
        "scheduledBatchId"
    ];

    protected $with = ['schedule'];
    protected $appends = ['tripTypeName'];

    /**
     * Por padrão o Eloquent aplica Str::snake() em toda relação com mais de
     * uma palavra ao serializar (ex: tripWayPoints -> trip_way_points).
     * Desligado para manter as chaves de relação em camelCase, o mesmo
     * formato já consumido pelo app e pelo front.
     */
    public static $snakeAttributes = false;

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

    public function customer()
    {
        return $this->centralCustomer()
            ->leftJoin('user AS centralCustomerUser', 'centralCustomer.userId', '=', 'centralCustomerUser.idUser')
            ->leftJoin('customer AS centralCustomerProfile', 'centralCustomerUser.idUser', '=', 'centralCustomerProfile.userId')
            ->select([
                'centralCustomer.id',
                'centralCustomer.name AS name',
                'centralCustomer.name AS nickname',
                'centralCustomer.phone',
                'centralCustomerProfile.profileImage AS profileImage',
            ]);
    }

    public function driverCommission()
    {
        return $this->belongsTo(
            DriverCommission::class,
            'driverCommissionId',
            null,
            'driverCommission');
    }

    public function partnerCommission()
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

    public function deliveryInfo()
    {
        return $this->hasOne(DeliveryInfo::class, 'tripReference', 'tripReference');
    }

    public function tripItems()
    {
        return $this->hasMany(TripItem::class, 'tripReference', 'tripReference');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    public function tripTypeMinimal()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId')
            ->select(['idTripType', 'type']);
    }

    public function getTripTypeNameAttribute()
    {
        return $this->tripTypeMinimal ? $this->tripTypeMinimal->type : null;
    }

    public function schedule()
    {
        return $this->hasOne(TripScheduled::class, 'tripReference', 'tripReference');
    }

    public function cancellationReason()
    {
        return $this->belongsTo(CancellationReason::class, 'cancellationReasonsId', 'idCancellationReasons');
    }
}
