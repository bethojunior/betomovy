<?php

namespace App\Repositories\FinancialIntermediary;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\AcquirerMetaDataCity;

class AcquirerMetaDataCityRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AcquirerMetaDataCity::class);
    }

    public function disableAllInCity(int $cityId)
    {
        return $this->getModel()::where('cityId', $cityId)
            ->where('active', 1)
            ->update(['active' => 0]);
    }

    public function deleteByAcquirerMetaDataIdAndCity(int $acquirerMetaDataId, int $cityId)
    {
        return AcquirerMetaDataCity::where('acquirerMetaDataId', $acquirerMetaDataId)
            ->where('cityId', $cityId)
            ->whereNull('deleted_at')
            ->delete();
    }
}
