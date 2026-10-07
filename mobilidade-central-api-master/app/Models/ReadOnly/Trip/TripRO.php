<?php

namespace App\Models\ReadOnly\Trip;

use App\Models\Central\CentralCustomer;
use App\Models\Trip\DeliveryInfo;
use App\Models\Trip\Destination;
use App\Models\Trip\DriverCommission;
use App\Models\Trip\Origin;
use App\Models\Trip\PartnerCommission;
use App\Models\Trip\TripItem;
use App\Models\Trip\TripPaymentForm;
use App\Models\Trip\TripWayPoint;
use App\Models\Trip\Zone;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Utils\UUID;
use Illuminate\Database\Eloquent\Model;

class TripRO extends Model
{
    protected $connection = 'mysql_ro';

    const UPDATED_AT = null;

    const CREATED_AT = 'date';

    protected $table = 'trip';

    protected $primaryKey = 'idTrip';
}
