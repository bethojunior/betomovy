<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 11:49
 */

namespace App\Services\Delivery;


use App\Exceptions\Company\DeliveryNeighborhoodException;
use App\Models\Delivery\DeliveryNeighborhood;
use App\Repositories\Delivery\DeliveryNeighborhoodRepository;
use App\Utils\Polygon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class DeliveryNeighborhoodService
{
    /**
     * @var DeliveryNeighborhoodRepository
     */
    private $repository;

    public function __construct(DeliveryNeighborhoodRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        $result =  $this->repository
            ->findAll($request);

        return array_map(function ($value) {
            $value['area'] = $value['area'] ? Polygon::polygonToArray($value['area']) : [];
            return (object) $value;
        }, $result->toArray());
    }

    public function store(array $request)
    {
        $deliveryNeighborhood = new DeliveryNeighborhood($request);
        $polygon = Polygon::polygonToString($request['area']);
        $deliveryNeighborhood->area = DB::raw("ST_GeomFromText({$polygon})");
        $deliveryNeighborhood->save();

        return $deliveryNeighborhood;
    }

    public function update(array $request, DeliveryNeighborhood $deliveryNeighborhood)
    {
        $deliveryNeighborhood->name = $request['name'] ?? $deliveryNeighborhood->name;
        $deliveryNeighborhood->deliveryPrice = $request['deliveryPrice'] ?? $deliveryNeighborhood->deliveryPrice;
        $polygon = Polygon::polygonToString($request['area']);
        $deliveryNeighborhood->area = DB::raw("ST_GeomFromText({$polygon})");
        $deliveryNeighborhood->cityId = $request['cityId'] ?? $deliveryNeighborhood->cityId;

        $deliveryNeighborhood->save();

        return $deliveryNeighborhood;
    }

    /**
     * @param DeliveryNeighborhood $deliveryNeighborhood
     * @return bool|null
     * @throws \Exception
     */
    public function delete(DeliveryNeighborhood $deliveryNeighborhood)
    {
        if (!$deliveryNeighborhood->id)
            throw new DeliveryNeighborhoodException("Bairro nao encontrado");

        //Excluir todos os preços dos estabelecimentos vinculados a esse bairro

        return $deliveryNeighborhood->delete();
    }
}
