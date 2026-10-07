<?php


namespace Common\Models\Company;

use Common\Models\Driver\Driver;
use Illuminate\Database\Eloquent\Model;

class CompanyDeliveryMan extends Model
{
    protected $table = "companyDeliveryMan";

    protected $fillable = [
        "driverId",
        "companyId"
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class,"driverId",'idDriver');
    }
}
