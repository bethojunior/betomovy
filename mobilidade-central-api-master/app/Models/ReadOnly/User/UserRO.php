<?php

namespace App\Models\ReadOnly\User;

use App\Models\Central\CentralUser;
use App\Models\User\Customer;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserRO extends Authenticatable
{
    use Notifiable;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    protected $connection = 'mysql_ro';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','phone'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'deviceToken',
        'facebook_id',
        'google_id',
        'role_id',
        'bankAccountId',
        'platform'
    ];

    public function centralUser()
    {
        return $this->hasMany(CentralUser::class, 'userId');
    }

    public function customer()
    {
        return $this->hasOne(CustomerRO::class, 'userId');
    }
}
