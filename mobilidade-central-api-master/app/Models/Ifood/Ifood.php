<?php

namespace App\Models\Ifood;

use Illuminate\Database\Eloquent\Model;
use App\Models\Central\Central;

class Ifood extends Model
{
    protected $table = 'ifood_keys';

    protected $fillable = [
        'clientId',
        'clientSecret',
        'centralId',
        'token'
    ];

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId', 'id');
    }
}
