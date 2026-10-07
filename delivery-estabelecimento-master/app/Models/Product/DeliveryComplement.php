<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryComplement extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryComplement';

    protected $fillable = [
        'name',
        'description',
        'price',
        'active',
        'deliveryGroupComplementId',
    ];
}
