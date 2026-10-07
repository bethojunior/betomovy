<?php

namespace App\Models\User;

use App\Models\Car\Car;
use App\Models\Central\CentralDriver;
use App\Models\Trip\Trip;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $table = 'driver';

    protected $primaryKey = 'idDriver';

    const UPDATED_AT = null;

    protected $appends = ['profileImageUrl'];

    /**
     * URL pública da foto do motorista (compressed), mesmo storage/caminho
     * usado pelo mobilidade-api-php (Driver::PROFILE_DIR . Photo::COMPRESSED_DIR).
     * Só resolve quando a query seleciona 'profileImage'.
     */
    public function getProfileImageUrlAttribute()
    {
        if (!$this->profileImage) {
            return null;
        }

        return \Storage::disk('minio')->url('driver/profile/compressed/' . $this->profileImage);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'idUser');
    }

    public function central()
    {
        return $this->hasMany(CentralDriver::class, 'driverId');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class, 'driverId', 'idDriver');
    }

    public function car()
    {
        return $this->hasOne(Car::class, 'driverId', 'idDriver')
            ->whereNull('deleted_at')
            ->where(function ($q) {
                $q->whereNull('pending')->orWhere('pending', '<>', 1);
            })->select(['idCar', 'driverId', 'plate', 'color', 'brand', 'model', 'year']);
    }
}
