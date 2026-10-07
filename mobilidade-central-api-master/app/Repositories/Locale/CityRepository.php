<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:28
 */

namespace App\Repositories\Locale;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Builder;

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

    public function all($query = null, $estateId = null)
    {
        return $this->getModel()
            ::when($query, function (Builder $builder, $query){
                $builder->where('nome', 'LIKE', "%{$query}%");
            })
            ->when($estateId, function (Builder $builder, $estateId){
                $builder->where('estado', $estateId);
            })
            ->get();
    }

    public function findByCoordinate($lat, $lng)
    {
        return $this->getModel()
            ::join('cityArea', 'cityArea.cityId', '=', 'city.id')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->whereRaw("
                ST_CONTAINS(cityArea.polygon, ST_GeomFromText('POINT({$lat} {$lng})'))
            ")
            ->selectRaw("city.*")
            ->first();
    }
}
