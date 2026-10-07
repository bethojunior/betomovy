<?php
/**
 * Created by PhpStorm.
 * User: Junin
 * Date: 12/05/2023
 * Time: 10:23
 */

namespace App\Repositories\Tax;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Tax\Tax;

class TaxRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Tax::class);
    }


    public function findActivesByCityAndTripType(int $cityId, int $tripTypeId, ?array $chargeBy = ['customer', 'driver'])
    {
        return $this->getModel()::where('cityId', $cityId)
                ->where('active', true)
                ->where('tripTypeId', $tripTypeId)
                ->where('deleted_at', null)
                ->whereIn('chargeBy', $chargeBy)
                ->get();
    }


}
