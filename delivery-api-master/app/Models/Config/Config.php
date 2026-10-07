<?php
namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'config';

    protected $primaryKey = 'idConfig';
}
