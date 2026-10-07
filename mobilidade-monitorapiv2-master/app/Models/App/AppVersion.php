<?php


namespace App\Models\App;


use Illuminate\Database\Eloquent\Model;

class AppVersion extends Model
{
    protected $table = 'appVersion';

    protected $fillable = [
        'version',
        'platform',
        'link',
        'appId',
        'statusId',
    ];
}
