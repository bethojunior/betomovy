<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:24
 */

namespace App\Repositories\ExternalService;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class ExternalServiceTypeRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ExternalServiceType::class);
    }

    public function findAll(array $request = []): Collection
    {
        return $this->getModel()::select('externalServiceType.*')
            ->when(isset($request['externalServiceGroupId']), function (Builder $query) use ($request) {
                $query->join('externalServiceTypeGroup', 'externalServiceType.id', 'externalServiceTypeGroup.externalServiceTypeId')
                    ->where('externalServiceTypeGroup.externalServiceGroupId', $request['externalServiceGroupId']);
            })
            ->get();
    }

    public function findFully(array $request = []): Collection
    {
        return $this->getModel()::whereHas('externalServices', function (Builder $query) {
            $query->where('frontEndConfigurable', true)
                ->where('statusId', StatusConst::ACTIVE);
        })
            ->with([
                'externalServices' => function (HasMany $query) use ($request) {
                    $query->select(
                        'externalService.id',
                        'externalService.name',
                        'externalService.externalServiceTypeId'
                    )->when(isset($request['cityId']), function (Builder $query) use ($request) {
                        $query->join('externalServiceMetaData', 'externalService.id', 'externalServiceMetaData.externalServiceId')
                            ->leftJoin('externalServiceMetaDataCity', function (JoinClause $join) use ($request) {
                                $join->on('externalServiceMetaData.id', 'externalServiceMetaDataCity.externalServiceMetaDataId')
                                    ->where('externalServiceMetaDataCity.statusId', StatusConst::ACTIVE)
                                    ->where('externalServiceMetaDataCity.cityId', $request['cityId']);
                            })
                            ->groupBy('externalService.id')
                            ->orderBy('externalService.id')
                            ->addSelect(DB::raw('if(externalServiceMetaDataCity.statusId is not null, if(externalServiceMetaDataCity.statusId = 1, 1, 0), 0) as active'))
                            ->with([
                                'externalServiceMetaData' => function (HasMany $query) use ($request) {
                                    $query->select(
                                        'externalServiceMetaData.id',
                                        'externalServiceMetaData.key',
                                        'externalServiceMetaData.description',
                                        'externalServiceMetaData.externalServiceId',
                                        'externalServiceMetaDataCity.value'
                                    )->leftJoin('externalServiceMetaDataCity', function (JoinClause $join) use ($request) {
                                        $join->on('externalServiceMetaData.id', 'externalServiceMetaDataCity.externalServiceMetaDataId')
                                            ->where('externalServiceMetaDataCity.statusId', StatusConst::ACTIVE)
                                            ->where('externalServiceMetaDataCity.cityId', $request['cityId']);
                                    });
                                }
                            ]);
                    }, function (Builder $query) {
                        $query->addSelect('externalService.active')
                            ->with('externalServiceMetaData');
                    })
                        ->where('externalService.frontEndConfigurable', true)
                        ->where('externalService.statusId', StatusConst::ACTIVE);
                }
            ])
            ->get();
    }
}
