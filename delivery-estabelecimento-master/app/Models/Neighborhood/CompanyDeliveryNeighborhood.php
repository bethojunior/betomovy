<?php

namespace App\Models\Neighborhood;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyDeliveryNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'companyDeliveryNeighborhood';

    protected $fillable = [
        'companyId',
        'deliveryNeighborhoodId',
        'price'
    ];
}
