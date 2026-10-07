<?php

namespace App\Repositories\Config;

use App\Constants\Config\RiskAreaStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\RiskArea;
use Illuminate\Database\Eloquent\Builder;

class RiskAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(RiskArea::class);
    }

    public function findAll($cityId, array $queryRequest = [])
    {
        return $this->getModel()
            ::where("cityId",$cityId)
            ->where("status","!=",RiskAreaStatusConst::REJECTED)
            ->with([
                'user'
            ])
            ->when(isset($queryRequest['status']), function (Builder $query) use ($queryRequest){
                $query->where('status', $queryRequest['status']);
            })
            ->orderByDesc('id')
            ->paginate();
    }

    public function refuse($id)
    {
        $this->getModel()
            ::where('id', $id)
            ->update(['status' => RiskAreaStatusConst::REJECTED]);
    }

    public function confirmed($id, array $request)
    {
        $this->getModel()
            ::where('id', $id)
            ->update([
                'status' => RiskAreaStatusConst::CONFIRMED,
                'radius' => $request['radius']
            ]);
    }
}
