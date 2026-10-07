<?php

namespace App\Models\Route;

use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Model;

class CorporateRoute extends Model
{
    protected $table = "corporateRoute";

    protected $fillable = [
        'routeId',
        'companyId'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function route()
    {
        return $this->belongsTo(Route::class, "routeId");
    }
}
