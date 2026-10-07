<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2019
 * Time: 11:26
 */

namespace App\Repositories\CityConfig;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\CityConfig;
use Illuminate\Database\Eloquent\Builder;

class CityConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CityConfig::class);
    }

    public function getByCoordinate($lat, $lng)
    {
        return $this->getModel()
            ::whereHas('cityArea', function (Builder $query) use ($lat, $lng){
                $query
                    ->whereRaw("
                        cityArea.statusId = 1 AND
                        ST_CONTAINS(cityArea.polygon, ST_GeomFromText('POINT({$lat} {$lng})'))
                    ");
            })
            ->first();
    }
}
