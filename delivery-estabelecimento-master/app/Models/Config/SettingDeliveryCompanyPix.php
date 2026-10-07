<?php


namespace App\Models\Config;


use Illuminate\Database\Eloquent\Model;

class SettingDeliveryCompanyPix extends Model
{
    protected $table = 'settingDeliveryCompanyPix';

    protected $fillable = [
        'merchantName',
        'merchantCity',
        'pixKey',
        'description',
        'companyId',
    ];
}
