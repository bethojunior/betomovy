<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 19:30
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\DriversCloseTheTrip;
use Illuminate\Database\Eloquent\Builder;

class DriversCloseTheTripRepository extends AbstractRepository
{
    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriversCloseTheTrip::class);
    }

    public function findDriversClose($tripReference, $centralId)
    {
        return $this->getModel()
            ::selectRaw("
                IF(FIND_IN_SET(idDriver, favoriteDrivers) > 0, 1, 0) AS isFav,
                tripReference,
                idDriver,
                proximity,
                destinationProximity,
                radius,
                greaterRadius,
                tripTypeId,
                rating,
                driverType,
                favoriteDrivers,
                ((rating / 2) - ((proximity / 2) + (destinationProximity / 10))) AS returnValue,
                ((rating / 2) - (proximity / 10)) AS proximityValue,
                status,
                preAvailable,
                appIsOpen,
                deviceToken
            ")
            ->where('tripReference', $tripReference)
            ->whereHas('centralDriver', function (Builder $query) use ($centralId){
                $query
                    ->where('centralId', $centralId)
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->havingRaw("
                CASE
                    WHEN
                        tripTypeId = 1 AND
                        isFav = 0 AND
                        driverType != 8
                    THEN
                        destinationProximity < greaterRadius AND proximity < greaterRadius
                    ELSE
                        proximity < greaterRadius
                END
            ")
            ->orderByDesc('isFav')
            ->orderByRaw('
                CASE
                    WHEN tripTypeId = 1 THEN
                        returnValue
                    ELSE
                        proximityValue
                END DESC
            ')
            ->orderBy('preAvailable')
            ->get();
    }
}
