<?php

namespace App\Models\Driver;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class FavoriteDriver extends Model
{
    protected $table = 'favoriteDriver';

    protected $primaryKey = 'idFavorite';


    const UPDATED_AT = null;
    const CREATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
