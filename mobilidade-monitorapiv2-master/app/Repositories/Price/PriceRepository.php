<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/08/2020
 * Time: 12:31
 */

namespace App\Repositories\Price;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Price;

class PriceRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Price::class);
    }

    public function disableByTripType(int $tripTypeId)
    {
        return $this->getModel()
            ::where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }
}
