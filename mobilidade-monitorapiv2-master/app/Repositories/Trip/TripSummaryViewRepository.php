<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 16:13
 */

namespace App\Repositories\Trip;


use App\Constants\Trip\TripConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripSummaryView;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TripSummaryViewRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripSummaryView::class);
    }

    public function findActivesByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->whereNotIn('status', [
                TripConst::CANCELED,
                TripConst::FINISHED,
                TripConst::BACK_OFF,
                TripConst::NOT_ANSWERED,
                TripConst::PAYMENT_REFUSED,
            ])
            ->with(['customer' => function (BelongsTo $query){
                $query
                    ->select([
                        'idCustomer',
                        'appVersion',
                        'userId'
                    ]);
            }])
            ->with(['driver' => function (BelongsTo $query){
                $query
                    ->select([
                        'idDriver',
                        'userId',
                        'appVersion',
                    ]);
            }])
            ->with(['driversCalled' => function (HasMany $query){
                $query
                    ->select([
                        'tripReference',
                        'driverId',
                        'proximity',
                        'destinationProximity',
                        'driverCalled.status',
                        'name',
                        'nickname',
                        'phone'
                    ])
                    ->join('driver', 'idDriver', '=', 'driverId')
                    ->join('user', 'idUser', '=', 'userId');
            }])
            ->orderBy('date', 'DESC')
            ->get();
    }

    public function findFully($tripReference)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->with([
                'driverCommission',
                'tripWayPoints',
                'fare',
                'recalculatedTrip',
                'tripLongDistance',
                'rewardCampaignTrip' => function (HasMany $query) {
                    $query
                        ->join('rewardTripType', 'rewardTripTypeId', '=', 'rewardTripType.id')
                        ->select(
                            'rewardCampaignTrip.id',
                            'rewardTripType.name AS rewardTripType',
                            'rewardCampaignTrip.value',
                            'rewardCampaignTrip.rewardTripTypeId',
                            'rewardCampaignTrip.tripReference'
                        );
                },
                'rewardTripLongDistance' => function (HasOne $query) {
                    $query
                        ->join('rewardTripType', 'rewardTripTypeId', '=', 'rewardTripType.id')
                        ->select(
                            'rewardTrip.id',
                            'rewardTripType.name AS rewardTripType',
                            'rewardTrip.value',
                            'rewardTrip.rewardTripTypeId',
                            'rewardTrip.tripReference'
                        );
                },
                'tolls' => function (BelongsToMany $query) {
                    $query
                        ->select(
                            'toll.id',
                            'name',
                            'address',
                            'value'
                        )
                        ->withoutGlobalScopes();
                }
            ])
            ->first();
    }
}
