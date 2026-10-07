<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class FavoriteDriver extends Model
{
    const STATUS_ATIVO = 1;
    const STATUS_EXCLUIDO = 2;

    protected $table = 'favoriteDriver';

    protected $primaryKey = 'idFavorite';

    protected $fillable = [
        'customerId', 'driverId', 'status',
    ];

    const UPDATED_AT = null;
}
