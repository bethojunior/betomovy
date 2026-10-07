<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class DependentUser extends Model
{
    protected $table = 'dependentUser';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
