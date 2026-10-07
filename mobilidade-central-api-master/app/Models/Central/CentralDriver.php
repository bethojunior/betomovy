<?php

namespace App\Models\Central;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class CentralDriver extends Model
{
    protected $table = 'centralDriver';

    protected $fillable = [
        'centralId', 'driverId', 'isFavorite'
    ];

    protected $appends = ['profileImageUrl'];

    public function central()
    {
        return $this->belongsTo(Central::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    /**
     * URL pública da foto do motorista (compressed), mesmo storage/caminho
     * usado pelo mobilidade-api-php (Driver::PROFILE_DIR . Photo::COMPRESSED_DIR).
     * Só resolve quando a query seleciona 'driver.profileImage' (ex: findActivesPerCentral).
     */
    public function getProfileImageUrlAttribute()
    {
        if (!$this->profileImage) {
            return null;
        }

        return \Storage::disk('minio')->url('driver/profile/compressed/' . $this->profileImage);
    }
}
