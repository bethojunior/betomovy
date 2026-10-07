<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 15:21
 */

namespace App\Models\Driver;


use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $table = 'driver';

    protected $primaryKey = 'idDriver';

    public function getProfileImageAttribute()
    {
        return $this->attributes['profileImage'] ?
            \Storage::cloud()
                ->url('driver/profile/compressed/' . $this->attributes['profileImage']) :
            null;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
