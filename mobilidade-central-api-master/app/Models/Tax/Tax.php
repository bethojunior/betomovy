<?php

namespace App\Models\Tax;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'tax';

    protected $fillable = [
      'id',
      'name',
      'value',
      'valueType',
      'description',
      'cityId',
      'tripTypeId',
      'chargeBy',
      'userId',
      'active',
      'created_at',
      'updated_at',
      'deleted_at'
    ];
}
