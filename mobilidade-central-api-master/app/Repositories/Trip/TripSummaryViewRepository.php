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
use App\Models\ReadOnly\Trip\TripSummaryView;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
