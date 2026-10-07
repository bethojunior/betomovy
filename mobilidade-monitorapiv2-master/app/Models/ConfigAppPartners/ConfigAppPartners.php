<?php


namespace App\Models\ConfigAppPartners;

use App\Models\AppPartners\TripTypePartnerLinked;
use App\Models\AppPartners\UserTypeLinkedAppPartner;
use Illuminate\Database\Eloquent\Model;

class ConfigAppPartners extends Model
{
  protected $table = 'config_apps_partners';
  protected $primaryKey = 'id';

  protected $fillable = [
    'key',
    'name_app',
    'logo_app',
    'primary_color',
    'secondary_color',
    'text_color',
    'phone_support'
  ];

  public function tripTypePartnerLinked()
  {
    return $this->hasMany(TripTypePartnerLinked::class, 'config_apps_partners_id', 'id');
  }

  public function userTypeLinkedAppPartner()
  {
    return $this->hasMany(UserTypeLinkedAppPartner::class, 'config_apps_partners_id', 'id');
  }
}
