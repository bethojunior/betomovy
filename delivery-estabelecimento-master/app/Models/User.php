<?php

namespace App\Models;

use App\Models\Company\CompanyWorker;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'name', 'email', 'password', 'phone'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = base64_encode($password);
    }

    public function setPhoneAttribute($phone)
    {
        return $this->attributes['phone'] = clearFormatPhone($phone);
    }

    public function companyWorker()
    {
        return $this->hasOne(CompanyWorker::class, 'userId');
    }

    public function userType()
    {
        return $this->hasOneThrough(
            UserType::class,
            LevelAccess::class,
            'userId',
            'idUserType',
            'idUser',
            'userTypeId');
    }

}
