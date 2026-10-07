<?php


namespace App\Models\Audit;

use Illuminate\Database\Eloquent\Model;


class Audit extends Model
{
    protected $table = "audit";
    public const UPDATED_AT = null;
    protected $fillable = [
      'name',
      'email',
      'phone',
      'message'
    ];
}
