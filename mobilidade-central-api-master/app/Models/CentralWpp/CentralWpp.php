<?php

namespace App\Models\CentralWpp;

use Illuminate\Database\Eloquent\Model;

class CentralWpp extends Model
{
  protected $table = 'central_wpp';

  protected $fillable = [
    'centralId',
    'sessionName',
    'groups'
  ];

  protected $casts = [
    'groups' => 'array',
  ];
}
