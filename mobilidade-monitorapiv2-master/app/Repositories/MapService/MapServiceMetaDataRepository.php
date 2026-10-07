<?php


namespace App\Repositories\MapService;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\MapService\MapServiceMetaData;
use App\Models\MapService\MapServiceMetaDataCity;

class MapServiceMetaDataRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(MapServiceMetaData::class);
    }

    public function findByKey(string $key)
    {
        return $this->getModel()::where('key', $key)->first();
    }

    public function disableByGroup(string $groupCode)
    {
        return MapServiceMetaDataCity::join('mapServiceMetaData', 'mapServiceMetaDataCity.mapServiceMetaDataId', 'mapServiceMetaData.id')
            ->where('groupCode', $groupCode)
            ->update(['mapServiceMetaDataCity.statusId' => StatusConst::REMOVED]);
    }
}
