<?php

namespace App\Models\User;

use App\Models\Central\CentralCustomer;
use App\Models\Central\CentralUser;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','phone', 'profilePhoto', 'dateOfBirth', 'nickname', 'key_app_partner'
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

    public function centralCustomer()
    {
        return $this->hasMany(CentralCustomer::class, 'userId');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'userId');
    }
}
