<?php

namespace App\Models\Central;

use App\Models\Trip\Zone;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class Central extends Model
{
    protected $table = 'central';

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'address',
        'responsibleId',
        'syncCustomers',
        'showAllPrices',
        'centralCallDriver',
        'enableCustomRadiusCentral',
        'placesSearchRadius',
        'discount_type',
        'discount_value'
    ];

    protected $hidden = [
        'statusId'
    ];

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsibleId');
    }

    public function centralUsers()
    {
        return $this->hasMany(CentralUser::class, 'centralId');
    }

    public function centralDrivers()
    {
        return $this->hasMany(CentralDriver::class, 'centralId');
    }

    public function zone()
    {
        return $this->hasOne(Zone::class, 'centralId');
    }

    public function getLogoAttribute()
    {
        return $this->attributes['logo'] ?
            \Storage::cloud()
            ->url($this->attributes['logo']) : null;
    }
}
