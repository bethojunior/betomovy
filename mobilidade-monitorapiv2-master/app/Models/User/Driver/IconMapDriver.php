<?php


namespace App\Models\User\Driver;


use Illuminate\Database\Eloquent\Model;

class IconMapDriver extends Model
{
    protected $table = 'iconMapDriver';

    protected $fillable = ['link', 'statusId'];
    public $timestamps = false;
}
