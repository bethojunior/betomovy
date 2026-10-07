<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 20:09
 */

namespace App\Repositories\Central;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Neighborhood;
use App\Models\Central\Price;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * @param $centralId
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]|\Illuminate\Support\Collection
     */
    public function findByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->orderBy('tripTypeId')
            ->get();
    }

    public function findByNeighborhood($centralId, Neighborhood $neighborhood)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'tripType' => function (BelongsTo $query) use ($neighborhood, $centralId) {
                    return $query->with(['centralNeighborhood' => function (BelongsTo $query) use ($neighborhood, $centralId) {
                        return $query
                            ->with(["neighborhood" => function($query){
                                return $query->select([
                                    'id',
                                    'name'
                                ])
                                    ->selectRaw('ST_AsText(area) AS area');
                            }])
                            ->where("neighborhoodId", $neighborhood->id)
                            ->where("centralId", $centralId);
                    }])
                        ->whereHas("centralNeighborhood");
                }
            ])
            ->whereHas('tripType', function ($query) use ($neighborhood, $centralId) {
                return $query
                    ->whereHas('centralNeighborhood', function ($query) use ($neighborhood, $centralId) {
                        return $query->where("neighborhoodId", $neighborhood->id)
                            ->where("centralId", $centralId);
                    })->whereHas("centralNeighborhood");
            })
            ->where("cityId", $neighborhood->cityId)
            ->orderBy('tripTypeId')
            ->get();
    }
}
