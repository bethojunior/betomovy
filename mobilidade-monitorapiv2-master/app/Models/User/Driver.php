<?php

namespace App\Models\User;

use App\Constants\StatusConst;
use App\Models\Balance\Balance;
use App\Models\CallGroup\CallGroup;
use App\Models\Central\CentralDriver;
use App\Models\Driver\DriverAddress;
use App\Models\Driver\DriverSplitConfig;
use App\Models\Locale\City;
use App\Models\Trip\Trip;
use App\Models\Trip\TripHistory;
use App\Models\User\Doc\DocUser;
use App\Models\User\Driver\Car;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Driver extends Model
{
    protected $table = 'driver';
    protected $primaryKey = 'idDriver';

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }

    public function central()
    {
        return $this->hasMany(CentralDriver::class, 'driverId');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class, 'driverId', 'idDriver');
    }

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId', 'idBalance');
    }

    public function docsUser()
    {
        return $this->hasManyThrough(
            DocUser::class, User::class, 'idUser', 'userId', 'userId')
            ->where('docUser.statusId', StatusConst::ACTIVE)
            ->orderByDesc('docUser.id');
    }

    public function tripHistory()
    {
        return $this->hasMany(TripHistory::class, 'driverId');
    }

    public function driverSplitConfig(): HasOne
    {
        return $this->hasOne(DriverSplitConfig::class, 'driverId');
    }

    public function driverAddress(): HasOne
    {
        return $this->hasOne(DriverAddress::class, 'driverId');
    }

    public function callGroups()
    {
        return $this->hasMany(CallGroup::class, 'call_group_id', 'id');
    }
    
    public function cars()
    {
        return $this->hasMany(Car::class, 'driverId', 'idDriver');
    }

    public function lastCar()
    {
        return $this->hasOne(Car::class, 'driverId', 'idDriver')->orderByDesc('idCar');
    }

}
