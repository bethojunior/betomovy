<?php


namespace App\Models\AppPartners;

use App\Models\ConfigAppPartners\ConfigAppPartners;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class TripTypePartnerLinked extends Model
{
    protected $table = 'tripTypePartnerLinked';
    protected $primaryKey = 'id';

    protected $fillable = [
      'tripTypePartnerId',
      'config_apps_partners_id'
    ];

    public function tripType()
    {
      return $this->belongsTo(TripType::class, 'tripTypePartnerId', 'idTripType');
    }

    public function configAppPartners()
    {
      return $this->belongsTo(ConfigAppPartners::class, 'config_apps_partners_id', 'id');
    }
}
