<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntegrationPartnersLogs extends Model
{
    use HasFactory;
    protected $fillable = ['data', 'return', 'origin', 'integration_partners_id'];
    
    public function integrationPartners() {
        return $this->hasOne(IntegrationPartners::class);
    }

}
