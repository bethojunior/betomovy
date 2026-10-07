<?php


namespace Common\Models\Driver;


use Common\Models\User;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{

    protected $table = "driver";
    protected $primaryKey = "idDriver";

    public function user()
    {
        return $this->belongsTo(User::class,"userId");
    }
}
