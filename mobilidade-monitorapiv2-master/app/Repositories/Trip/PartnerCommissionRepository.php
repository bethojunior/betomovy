<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/05/2020
 * Time: 10:06
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\PartnerCommission;
use Illuminate\Database\Eloquent\Builder;

class PartnerCommissionRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(PartnerCommission::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'tripType',
                'city',
            ])
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('cityId', $request['cityId']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query
                    ->where('tripTypeId', $request['tripTypeId']);
            })
            ->get();
    }
}
