<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:41
 */

namespace Delivery\Repositories\Neighborhood;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Neighborhood\DeliveryNeighborhood;

class DeliveryNeighborhoodRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryNeighborhood::class);
    }

    public function findByCoordinate($lat, $lng)
    {
        return $this->getModel()
            ::whereRaw('
                  cityId IN (
                        SELECT
                            cityArea.cityId
                        FROM cityArea
                            WHERE
                                cityArea.statusId = ? AND
                                ST_CONTAINS(
                                    cityArea.polygon,
                                    ST_GEOMFROMTEXT(CONCAT(\'POINT(\', ?, \' \', ?, \')\'))
                                )
                  )
            ', [1, $lat, $lng])
            ->get();
    }
}
