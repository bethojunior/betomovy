<?php


namespace App\Repositories\ExternalService;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalService;
use App\Models\ExternalService\ExternalServiceMetaDataCity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class ExternalServiceRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ExternalService::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::join('externalServiceType', 'externalService.externalServiceTypeId', 'externalServiceType.id')
            ->where('externalService.frontEndConfigurable', true)
            ->where('externalService.statusId', StatusConst::ACTIVE)
            ->select(
                'externalService.id',
                'externalService.name',
                'externalService.externalServiceTypeId',
                'externalServiceType.name as externalServiceTypeName',
                'externalService.active'
            )
            ->when(isset($request['externalServiceTypeId']), function (Builder $query) use ($request) {
                $query->where('externalServiceTypeId', $request['externalServiceTypeId']);
            })
            ->groupBy('externalService.id')
            ->orderBy('externalService.id')
            ->with(['externalServiceMetaData'])
            ->get();
    }


    public function findAllByType(int $type, array $request = [])
    {
        return $this->getModel()
            ::join('externalServiceType', 'externalService.externalServiceTypeId', 'externalServiceType.id')
            ->where('externalService.frontEndConfigurable', true)
            ->where('externalServiceTypeId', $type)
            ->where('externalService.statusId', StatusConst::ACTIVE)
            ->select(
                'externalService.id',
                'externalService.name',
                'externalService.externalServiceTypeId',
                'externalServiceType.name as externalServiceTypeName',
                'externalService.active'
            )
            ->groupBy('externalService.id')
            ->orderBy('externalService.id')
            ->with(['externalServiceMetaData'])
            ->get();
    }

    public function findAllByTypeAndCity(int $type, int $cityId, array $request = [])
    {
        return $this->getModel()
            ::join('externalServiceType', 'externalService.externalServiceTypeId', 'externalServiceType.id')
            ->where('externalService.frontEndConfigurable', true)
            ->where('externalServiceTypeId', $type)
            ->where('externalService.statusId', StatusConst::ACTIVE)
            ->select(
                'externalService.id',
                'externalService.name',
                'externalService.externalServiceTypeId',
                'externalServiceType.name as externalServiceTypeName',
                DB::raw('if(externalServiceMetaDataCity.statusId is not null, if(externalServiceMetaDataCity.statusId = 1, 1, 0), 0) as active')
            )
            ->join('externalServiceMetaData', 'externalService.id', 'externalServiceMetaData.externalServiceId')
            ->leftJoin('externalServiceMetaDataCity', function (JoinClause $join) use ($cityId) {
                $join->on('externalServiceMetaData.id', 'externalServiceMetaDataCity.externalServiceMetaDataId')
                    ->where('externalServiceMetaDataCity.statusId', StatusConst::ACTIVE)
                    ->where('externalServiceMetaDataCity.cityId', $cityId);
            })
            ->groupBy('externalService.id')
            ->orderBy('externalService.id')
            ->with([
                'externalServiceMetaData' => function (HasMany $query) use ($cityId) {
                    $query->select(
                        'externalServiceMetaData.id',
                        'externalServiceMetaData.key',
                        'externalServiceMetaData.description',
                        'externalServiceMetaData.externalServiceId',
                        'externalServiceMetaDataCity.value'
                    )->leftJoin('externalServiceMetaDataCity', function (JoinClause $join) use ($cityId) {
                        $join->on('externalServiceMetaData.id', 'externalServiceMetaDataCity.externalServiceMetaDataId')
                            ->where('externalServiceMetaDataCity.statusId', StatusConst::ACTIVE)
                            ->where('externalServiceMetaDataCity.cityId', $cityId);
                    });
                }
            ])
            ->get();
    }

    public function disableAllByType(int $externalServiceTypeId)
    {
        return $this->getModel()
            ::where('externalServiceTypeId', $externalServiceTypeId)
            ->update(['active' => 0]);
    }

    public function deleteAllByTypeAndCity(int $externalServiceTypeId, int $cityId)
    {
        return ExternalServiceMetaDataCity
            ::query()->join('externalServiceMetaData', 'externalServiceMetaDataCity.externalServiceMetaDataId', 'externalServiceMetaData.id')
            ->join('externalService', 'externalServiceMetaData.externalServiceId', 'externalService.id')
            ->where('externalService.externalServiceTypeId', $externalServiceTypeId)
            ->where('externalServiceMetaDataCity.cityId', $cityId)
            ->update(['externalServiceMetaDataCity.statusId' => StatusConst::REMOVED]);
    }
}
