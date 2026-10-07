<?php
/**
 * Created by PhpStorm.
 * User: Junin
 * Date: 12/05/2023
 * Time: 10:23
 */

namespace App\Repositories\TripTax;

use App\Contracts\Repository\AbstractRepository;
use App\Models\TripTax\TripTax;

class TripTaxRepository extends AbstractRepository
{
    public function __construct()
    {
      $this->setModel(TripTax::class);
    }


    public function findByTrip(int $idTrip, ?array $chargeBy = ['customer', 'driver'])
    {
        $query = $this->getModel()
        ::select('tax.id', 'tax.name', 'tax.value', 'tax.valueType', 'tax.description', 'tax.cityId', 'tax.tripTypeId', 'tax.chargeBy')
            ->join('tax', 'tax.id', '=', 'tripTax.taxId')
            ->where('tripId', $idTrip);
    
        if ($chargeBy) {
            $query->whereIn('chargeBy', $chargeBy);
        }
        
    
        return $query->get();
    }

    public function saveTripTax($data)
    {
      return $this->getModel()::create($data);
    }


}
