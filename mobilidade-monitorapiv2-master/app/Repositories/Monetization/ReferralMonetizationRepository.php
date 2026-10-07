<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 11:00
 */

namespace App\Repositories\Monetization;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Monetization\ReferralMonetization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ReferralMonetizationRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */

    public function __construct()
    {
        $this->setModel(ReferralMonetization::class);
    }

    public function findAll(array $queryRequest = [])
    {

        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'city' => function (BelongsTo $query) {
                    $query
                        ->select('id', 'nome AS cityName');
                },
                'tripTypes' => function (BelongsToMany $query) {
                $query
                    ->select(
                        'idTripType',
                        'type',
                        'order',
                        'tripType.statusId',
                        'tripType.description',
                        'backToTripBalance'
                    )
                    ->selectRaw('CONCAT(
                        (
                            SELECT
                                value
                            FROM config
                                WHERE `key` = \'link_storage_pictures\'
                        ),
                        \'tripType/\', picture) AS picture
                    ');
            }])
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest){
                $cityId = $queryRequest['cityId'];
                $query
                    ->whereRaw("( cityId = $cityId  OR cityId is null )");
            })
            ->orderByDesc('created_at')
            ->get();
    }
}
