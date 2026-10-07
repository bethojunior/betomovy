<?php

namespace App\Repositories\Trip;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\Role;
use App\Models\Trip\Tax;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class TaxRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Tax::class);
    }

    public function findAll(array $request = [], Role $roleAuthUser = null): Collection
    {
        return $this->getModel()::select(
            'id',
            'name',
            'value',
            'valueType',
            'description',
            'cityId',
            'tripTypeId',
            'chargeBy',
            'userId',
            'active'
        )
            ->whereNull('deleted_at')
            ->when(isset($roleAuthUser->support) && !$roleAuthUser->support, function (Builder $query) use ($roleAuthUser) {
                $query->whereIn('tax.cityId', function (\Illuminate\Database\Query\Builder $query) use ($roleAuthUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $roleAuthUser->id);
                });
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('cityId', $request['cityId']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query->where('tripTypeId', $request['tripTypeId']);
            })
            ->when(isset($request['chargeBy']), function (Builder $query) use ($request) {
                $query->where('chargeBy', $request['chargeBy']);
            })
            ->when(isset($request['active']), function (Builder $query) use ($request) {
                $query->where('active', $request['active']);
            })
            ->get();
    }
}
