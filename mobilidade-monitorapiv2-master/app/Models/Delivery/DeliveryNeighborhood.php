<?php

namespace App\Models\Delivery;

use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryNeighborhood';

    protected $fillable = [
        'name',
        'deliveryPrice',
        'cityId',
        'area'
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
