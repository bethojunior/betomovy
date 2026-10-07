<?php

namespace App\Models\Neighborhood;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryNeighborhood';

    public function companyDeliveryNeighborhood()
    {
        return $this->hasMany(CompanyDeliveryNeighborhood::class, 'deliveryNeighborhoodId');
    }
}
