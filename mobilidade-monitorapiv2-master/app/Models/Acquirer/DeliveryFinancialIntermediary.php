<?php

namespace App\Models\Acquirer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryFinancialIntermediary extends Model
{
    protected $table = 'deliveryFinancialIntermediary';
    public $timestamps = false;

    public function deliveryAcquirerMetaData(): HasMany
    {
        return $this->hasMany(DeliveryAcquirerMetaData::class, 'deliveryFinancialIntermediaryId');
    }
}
