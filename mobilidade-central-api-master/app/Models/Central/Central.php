<?php

namespace App\Models\Central;

use App\Constants\Central\CentralConst;
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
        'centralCallDriver',
        'balanceId',
        'key_app_partner',
        'discount_type',
        'discount_value'
    ];

    protected $hidden = [
        'statusId'
    ];

    public function getLogoAttribute()
    {
        return $this->attributes['logo'];
    }

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsibleId');
    }

    public function user()
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
}
