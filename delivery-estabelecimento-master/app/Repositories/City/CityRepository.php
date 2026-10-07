<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/06/2020
 * Time: 15:57
 */

namespace App\Repositories\City;


use App\Constants\StatusConst;
use Common\Contracts\Repository\AbstractRepository;
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

    public function findActives()
    {
        return $this->getModel()
            ::join('cityArea', 'cityArea.cityId', '=', 'city.id')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->select(
                'city.id AS cityId',
                'city.nome AS name'
            )
            ->selectRaw('IFNULL(city.shortName, city.nome) AS shortName')
            ->get();
    }
}
