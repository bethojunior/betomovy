<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 12:04
 */

namespace App\Models\Config;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddressBlacklist extends Model
{
    use SoftDeletes;

    protected $table = 'addressBlacklist';

    protected $fillable = [
        "address",
        "latitude",
        "longitude",
        "approved"
    ];
}
