<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'userType';

    protected $primaryKey = 'idUserType';

    protected $fillable = [
        'name',
        'description',
        'isActive',
        'picture',
        'isDeliveryMan',
        'isDriver'
    ];

    protected $hidden = [
        'statusId'
    ];
}
