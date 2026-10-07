<?php


namespace App\Models\Company;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyAddress extends Model
{
    use SoftDeletes;

    protected $table = 'companyAddress';

    protected $fillable = [
        'isDefault',
        'address',
        'latitude',
        'longitude',
        'companyId',
    ];

}
