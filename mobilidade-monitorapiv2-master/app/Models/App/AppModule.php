<?php


namespace App\Models\App;


use Illuminate\Database\Eloquent\Model;

class AppModule extends Model
{
    protected $table = 'appActiveModules';

    protected $fillable = [
        'appModuleId',
        'logo',
        'isActive',
        'statusId',
        'created_at',
        'updated_at'
    ];
}