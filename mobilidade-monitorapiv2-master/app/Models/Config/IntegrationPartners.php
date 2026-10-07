<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IntegrationPartners extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $fillable = ['token', 'action', 'name', 'url'];
    
    public function integrationPartnersLogs() {
        return $this->belongsTo(IntegrationPartnersLogs::class);
    }

}
