<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class ScheduleCorporateRoute extends Model
{
    protected $table = 'scheduleCorporateRoute';

    protected $fillable = [
        'schedule',
        'corporateRouteId',
        'title',
        'vacancies'
    ];

    public function corporateRoute()
    {
        return $this->belongsTo(CorporateRoute::class, "corporateRouteId");
    }

    public function days()
    {
        return $this->hasMany(ScheduleCorporateRouteWeek::class,"scheduleCorporateRouteId");
    }

}
