<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $table = "driver";

    public function user()
    {
        return $this->belongsTo(User::class, "userId");
    }

    public function getProfileImageAttribute()
    {
        return isset($this->attributes['profileImage']) ? \Storage::cloud()->url("driver/profile/compressed/" . $this->attributes['profileImage']) : null;
    }
}
