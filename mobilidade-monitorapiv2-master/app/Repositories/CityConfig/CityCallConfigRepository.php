<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 19:27
 */

namespace App\Repositories\CityConfig;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\CityConfig\CityCallConfig;

class CityCallConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CityCallConfig::class);
    }

    public function findAllByCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
