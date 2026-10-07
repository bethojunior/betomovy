<?php


namespace App\Models\Delivery;


use Illuminate\Database\Eloquent\Model;

class TypeDeliveryCategory extends Model
{
    protected $table = 'typeDeliveryCategory';

    protected $fillable = [
        'name',
        'description'
    ];
}
