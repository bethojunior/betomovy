<?php


namespace App\Models\App;


use Illuminate\Database\Eloquent\Model;

class AppAnimation extends Model
{
    protected $table = 'animationApp';

    protected $fillable = [
        'id_app',
        'screen',
        'type',
        'module_id',
        'active',
        'created_at',
        'updated_at'
    ];
}
