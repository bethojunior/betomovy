<?php

namespace App\Models\Config;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskArea extends Model
{
    use SoftDeletes;
    protected $table = "riskArea";

    protected $fillable = [
        "address",
        "latitude",
        "longitude",
        "radius",
        "status",
        "userId",
        "cityId"
    ];

    public function user()
    {
        return $this->belongsTo(User::class,"userId","idUser");
    }
}
