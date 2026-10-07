<?php


namespace App\Models\Company;


use Illuminate\Database\Eloquent\Model;

class EstablishmentCategoryDelivery extends Model
{
    protected $table = "establishmentCategoryDelivery";

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = [
        'companyId',
        'typeDeliveryCategoryId'
    ];
}
