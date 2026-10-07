<?php

namespace App\Models\ReadOnly\Central;

use App\Constants\Central\CentralConst;
use App\Models\Central\CentralDriver;
use App\Models\Central\CentralUser;
use App\Models\ReadOnly\User\UserRO;
use App\Models\Trip\Zone;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class CentralRO extends Model
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
        'balanceId'
    ];

    protected $connection = 'mysql_ro';

    protected $hidden = [
        'statusId'
    ];

    public function getLogoAttribute()
    {
        return CentralConst::LOGO_DIR_ROOT . $this->attributes['logo'];
    }

    public function responsible()
    {
        return $this->belongsTo(UserRO::class, 'responsibleId');
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
