<?php


namespace App\Models\Establishment;


use Illuminate\Database\Eloquent\Model;

class EstablishmentCollectionManagement extends Model
{
    protected $table = 'establishmentCollectionManagement';
    protected $fillable = [
        'label',
        'fixedValue',
        'orderValue',
        'orderPercentage',
        'statusId',
    ];
}
