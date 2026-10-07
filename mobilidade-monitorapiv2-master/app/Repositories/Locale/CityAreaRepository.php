<?php

namespace App\Repositories\Locale;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\CityArea;

class CityAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CityArea::class);
    }

    public function disableAreaByCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update([
                'statusId' => StatusConst::REMOVED
            ]);
    }

    public function getCityAreaByCityName($cityName, $estateId)
    {
        return $this->getModel()
            ::join('city', 'city.id', '=', 'cityArea.cityId')
            ->where('city.nome', 'like', "%{$cityName}%")
            ->where('city.estado', $estateId)
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->first();
    }
}
