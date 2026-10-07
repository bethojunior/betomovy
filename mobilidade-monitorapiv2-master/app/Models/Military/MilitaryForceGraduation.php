<?php

namespace App\Models\Military;

use Illuminate\Database\Eloquent\Model;

class MilitaryForceGraduation extends Model
{
    protected $table = 'militaryForceGraduation';

    protected $hidden = ['picture'];

    protected $fillable = [
        'patent',
        'level',
        'militaryForceId'
    ];

    public $timestamps = false;

    public function militaryForce()
    {
        return $this->belongsTo(MilitaryForce::class,'militaryForceId','id');
    }
}
