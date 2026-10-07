<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/11/2019
 * Time: 11:06
 */

namespace App\Contracts\Models;


use Illuminate\Database\Eloquent\Model;

abstract class Location extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'address', 'latitude', 'longitude', 'neighborhood', 'cityId', 'tag', 'complement'
    ];
}
