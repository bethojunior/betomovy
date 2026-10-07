<?php

namespace App\Models\Central;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class CentralUser extends Model
{
    protected $table = 'centralUser';

    protected $fillable = [
        'centralId',
        'userId',
        'isAdmin',
        'statusId',
    ];

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
