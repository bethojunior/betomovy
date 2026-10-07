<?php

namespace App\Models\ReadOnly\Driver;

use Illuminate\Database\Eloquent\Model;

class FavoriteDriverRO extends Model
{
    protected $table = 'favoriteDriver';

    protected $primaryKey = 'idFavorite';

    protected $connection = 'mysql_ro';

    const UPDATED_AT = null;
    const CREATED_AT = null;
}
