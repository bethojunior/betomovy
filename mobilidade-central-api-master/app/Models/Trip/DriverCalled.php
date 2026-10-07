<?php

namespace App\Models\Trip;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class DriverCalled extends Model
{
    protected $table = 'driverCalled';

    protected $fillable = [
        'driverId',
        'tripReference',
        'proximity',
        'destinationProximity',
        'status'
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    /**
     * A app troca a timezone da aplicação pra America/Fortaleza em toda request/comando
     * (TimezoneConfigMiddleware, TripCallCommand), mas a mobilidade-api-php lê
     * driverCalled.updated_at comparando contra UTC (TripDriversDao::findTripCallingDriver).
     * Força UTC aqui pra não gravar created_at/updated_at com ~3h de diferença.
     *
     * @return \Illuminate\Support\Carbon
     */
    public function freshTimestamp()
    {
        return \Illuminate\Support\Carbon::now('UTC');
    }
}
