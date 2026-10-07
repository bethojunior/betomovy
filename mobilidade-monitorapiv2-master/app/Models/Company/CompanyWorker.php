<?php

namespace App\Models\Company;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class CompanyWorker extends Model
{
    protected $table = 'companyWorker';

    protected $fillable = ['companyId', 'userId', 'isManager'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }
}
