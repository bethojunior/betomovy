<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/12/2019
 * Time: 08:10
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripTypeDriver;

class TripTypeDriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripTypeDriver::class);
    }

    public function findOne($tripTypeId, $userTypeId)
    {
        return $this->getModel()
            ::where('tripTypeId', $tripTypeId)
            ->where('userTypeId', $userTypeId)
            ->first();
    }

    /**
     * @param $tripTypeId
     * @param $userTypeId
     * @return bool|mixed|null
     * @throws \Exception
     */
    public function deleteTripTypeDriver($tripTypeId, $userTypeId)
    {
        return $this->getModel()
            ::where('tripTypeId', $tripTypeId)
            ->where('userTypeId', $userTypeId)
            ->delete();
    }
}
