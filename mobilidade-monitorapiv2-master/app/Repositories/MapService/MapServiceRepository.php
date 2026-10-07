<?php


namespace App\Repositories\MapService;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\MapService\MapService;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;

class MapServiceRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(MapService::class);
    }

    public function findWithMetaData()
    {
        return $this->getModel()::query()->where('statusId', StatusConst::ACTIVE)
            ->with(['mapServiceMetaData'])
            ->get();
    }

    public function findAll(int $cityId)
    {
        return $this->getModel()::query()->where('statusId', StatusConst::ACTIVE)
            ->with([
                'mapServiceMetaData' => function (HasMany $query) use ($cityId) {
                    $query->leftJoin('mapServiceMetaDataCity', function (JoinClause $join) use ($cityId) {
                        $join->on('mapServiceMetaData.id', 'mapServiceMetaDataCity.mapServiceMetaDataId')
                            ->where('mapServiceMetaDataCity.cityId', $cityId)
                            ->where('mapServiceMetaDataCity.statusId', StatusConst::ACTIVE);
                    })
                        ->whereNotNull('mapServiceMetaDataCity.groupCode')
                        ->select(
                            'mapServiceMetaData.id',
                            'mapServiceMetaData.key',
                            'mapServiceMetaDataCity.value',
                            'mapServiceMetaData.description',
                            'mapServiceMetaDataCity.cityId',
                            'mapServiceMetaData.mapServiceId',
                            'mapServiceMetaDataCity.groupCode'
                        );
                }
            ])
            ->get();
    }
}
