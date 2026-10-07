<?php


namespace App\Models\User;


use Illuminate\Database\Eloquent\Model;

class UserPenaltiesType  extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = "userPenaltiesType";

    protected $primaryKey = 'idUserPenaltyType';

    protected $fillable = [
        'valueRating'
    ];
}
