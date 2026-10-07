<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 16:56
 */

namespace App\Repositories\City;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\City\City;

class CityRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(City::class);
    }

    public function findByCoordinate(float $lat, float $lng)
    {
        return $this->getModel()
            ::join('cityArea', 'cityArea.cityId', '=', 'city.id')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->whereRaw("
                ST_CONTAINS(cityArea.polygon, ST_GeomFromText('POINT({$lat} {$lng})'))
            ")
            ->selectRaw('city.*')
            ->firstOrFail();
    }
}
