<?php


namespace Common\Models\Company;


use Common\Models\User;
use Illuminate\Database\Eloquent\Model;

class CompanyWorker extends Model
{
    protected $table = 'companyWorker';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
