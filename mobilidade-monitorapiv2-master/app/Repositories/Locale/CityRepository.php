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
use App\Models\Role\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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
            ::when($query, function (Builder $builder, $query) {
                $builder->where('nome', 'LIKE', "%{$query}%");
            })
            ->when($estateId, function (Builder $builder, $estateId) {
                $builder->where('estado', $estateId);
            })
            ->where('city.statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function findCityIdByNameAndEstate($query = null, $estateId = null)
    {
        return $this->getModel()
            ::when($query, function (Builder $builder, $query) {
                $builder->where('nome', '=', "{$query}");
            })
            ->when($estateId, function (Builder $builder, $estateId) {
                $builder->where('estado', $estateId);
            })
            ->where('city.statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function findWithCityAreaById(int $id)
    {
        return $this->getModel()
            ::where('city.id', $id)
            ->where('city.statusId', StatusConst::ACTIVE)
            ->join('cityArea', 'city.id', '=', 'cityArea.cityId')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->select(
                'city.id',
                'city.nome',
                'city.estado',
                'city.shortName',
                DB::raw("ST_ASTEXT(cityArea.polygon) as polygon")
            )
            ->first();
    }

    public function findById(int $id): ?City
    {
        /** @var City $result */
        $result = $this->getQuery()
            ->where('id', $id)
            ->with('state')
            ->first();

        return $result;
    }

    public function findByCoordinate($lat, $lng)
    {
        return $this->getModel()
            ::join('cityArea', 'city.id', 'cityArea.cityId')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->whereRaw("ST_CONTAINS(cityArea.polygon, ST_GeomFromText('POINT({$lat} {$lng})'))")
            ->first('city.*');
    }

    public function findActives()
    {
        return $this->getModel()
            ::join('cityArea', 'city.id', 'cityArea.cityId')
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->select(['cityId', 'nome'])
            ->orderBy("nome", "ASC")
            ->get();
    }

    public function findActivesFully(Role $authRole): Collection
    {
        return $this->getModel()
            ::join('cityArea', 'city.id', 'cityArea.cityId')
            ->select(
                'cityId',
                'city.nome',
                DB::raw("IFNULL(city.shortName, city.nome) as shortName"),
                DB::raw("ST_ASTEXT(cityArea.polygon) as polygon")
            )
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->whereIn('city.id', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                $query->select('cityId')
                    ->from('roleCity')
                    ->where('roleId', $authRole->id);
            })
            ->orderBy("nome", "ASC")
            ->get();
    }

    public function findTripTypes(int $cityId): Collection
    {
        return $this->getQuery()
            ->select('price.tripTypeId', 'tripType.type')
            ->join('price', 'price.cityId', '=', 'city.id')
            ->join('tripType', 'price.tripTypeId', '=', 'tripType.idTripType')
            ->where('price.statusId', StatusConst::ACTIVE)
            ->where('city.id', $cityId)
            ->get();
    }
}
