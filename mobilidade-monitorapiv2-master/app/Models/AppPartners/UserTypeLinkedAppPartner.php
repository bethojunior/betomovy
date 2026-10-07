<?php


namespace App\Models\AppPartners;

use App\Models\ConfigAppPartners\ConfigAppPartners;
use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;

class UserTypeLinkedAppPartner extends Model
{
    protected $table = 'userTypeLinkedAppPartner';
    protected $primaryKey = 'id';

    protected $fillable = [
      'userTypeId',
      'config_apps_partners_id'
    ];

    public function userType()
    {
      return $this->belongsTo(UserType::class, 'userTypeId', 'idUserType');
    }

    public function configAppPartners()
    {
      return $this->belongsTo(ConfigAppPartners::class, 'config_apps_partners_id', 'id');
    }
}
