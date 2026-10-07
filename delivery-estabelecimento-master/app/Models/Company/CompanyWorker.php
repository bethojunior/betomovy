<?php

namespace App\Models\Company;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CompanyWorker extends Model
{
    protected $table = 'companyWorker';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }
}
