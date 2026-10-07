<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 19:30
 */

namespace App\Repositories\Trip;


use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Central;
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

    public function findDriversClose($tripReference, Central $central)
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
                returnOption,
                preAvailable,
                appIsOpen,
                deviceToken
            ")
            ->where('tripReference', $tripReference)
            ->when(
                $central->centralCallDriver == CentralConst::ONLY_CENTRAL_DRIVERS,
                function ($query) use ($central) {
                    $query
                        ->whereHas('centralDriver', function (Builder $query) use ($central) {
                            $query
                                ->where('centralId', $central->id)
                                ->where('statusId', StatusConst::ACTIVE);
                        });
                }
            )
            ->when(
                $central->centralCallDriver == CentralConst::ONLY_APP_DRIVERS,
                function (Builder $query) {
                    $query
                        ->whereNotIn('idDriver', function (\Illuminate\Database\Query\Builder $query) {
                            $query
                                ->selectRaw('driverId')
                                ->from('centralDriver')
                                ->where('statusId', StatusConst::ACTIVE);
                        });
                }
            )
            ->havingRaw("
                CASE
                    WHEN
                        returnOption = 1 AND
                        isFav = 0
                    THEN
                        destinationProximity < greaterRadius AND proximity < greaterRadius
                    ELSE
                        proximity < greaterRadius
                END
            ")
            ->orderByDesc('isFav')
            ->orderByRaw('
                CASE
                    WHEN returnOption = 1 THEN
                        returnValue
                    ELSE
                        proximityValue
                END DESC
            ')
            ->orderBy('preAvailable')
            ->get();
    }
}
