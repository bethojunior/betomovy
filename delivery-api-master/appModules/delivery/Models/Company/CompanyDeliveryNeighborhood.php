<?php

namespace Delivery\Models\Company;

use Delivery\Models\Neighborhood\DeliveryNeighborhood;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyDeliveryNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'companyDeliveryNeighborhood';

    public function deliveryNeighborhood()
    {
        return $this->belongsTo(DeliveryNeighborhood::class, "deliveryNeighborhoodId");
    }
}
