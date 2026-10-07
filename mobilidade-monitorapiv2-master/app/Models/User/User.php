<?php

namespace App\Models\User;

use App\Models\Balance\BankAccount;
use App\Models\Central\CentralUser;
use App\Models\Company\CompanyWorker;
use App\Models\Manager\Manager;
use App\Models\Role\Role;
use App\Models\Trip\Trip;
use App\Models\User\Doc\DocUser;
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
        'name', 'nickname', 'email', 'password','deviceToken', 'phone', 'document', 'cityId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'facebook_id',
        'google_id',
        'role_id',
        'bankAccountId',
        'platform'
    ];

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

    public function whoIndicated()
    {
        return $this->hasOneThrough(
            User::class,
            UserIndication::class,
            'userIndicationId',
            'id',
            'idUser',
            'whoIndicatedId');
    }

//    public function referredUsers()
//    {
//        return $this->hasManyThrough(
//            User::class,
//            UserIndication::class,
//            'whoIndicatedId',
//            'idUser',
//            'idUser',
//            'userIndicatedId');
//    }

    public function referredUsers()
    {
        return $this->hasOne(UserIndicationView::class, 'whoIndicatedId');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'roleId');
    }

    public function docsUser()
    {
        return $this->hasMany(DocUser::class, 'userId');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class, 'userId');
    }

    public function companyWorker()
    {
        return $this->hasOne(CompanyWorker::class, 'userId');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'userId');
    }

    public function driver()
    {
        return $this->hasOne(Driver::class, 'userId');
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'bankAccountId');
    }

    public function responsible()
    {
        return $this->hasOne(DependentUser::class, 'userId');
    }

    public function dependents()
    {
        return $this->hasMany(DependentUser::class, 'responsibleId');
    }

    public function centralUsers()
    {
        return $this->hasMany(CentralUser::class, 'userId');
    }

    public function manager()
    {
        return $this->hasOne(Manager::class, 'userId');
    }
}
