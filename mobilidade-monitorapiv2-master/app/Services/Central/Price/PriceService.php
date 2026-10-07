<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 20:22
 */

namespace App\Services\Central\Price;


use App\Constants\StatusConst;
use App\Models\Central\Price;
use App\Repositories\Central\PriceRepository;
use App\Repositories\User\DriverRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class PriceService
{
    private $repository;
    private $driverRepository;

    public function __construct(PriceRepository $repository, DriverRepository $driverRepository)
    {
        $this->repository = $repository;
        $this->driverRepository = $driverRepository;
    }

    public function findAll(array $request = [], int $cityId = null): Collection
    {
        return $this->repository->findAll($request, $cityId);
    }

    public function store(array $request)
    {
        DB::beginTransaction();
        try {
            $preservedOrder = null;
            if (isset($request['cityId'], $request['tripTypeId'])) {
                $existingPrice = $this->repository->findActiveByCityAndTripType(
                    (int) $request['cityId'],
                    (int) $request['tripTypeId']
                );
                if ($existingPrice !== null && $existingPrice->order !== null) {
                    $preservedOrder = $existingPrice->order;
                }
            }
            $this->repository->removeInCityByTripType($request['cityId'], $request['tripTypeId']);
            if ($preservedOrder !== null && !isset($request['order'])) {
                $request['order'] = $preservedOrder;
            }
            $price = Price::create($request);

            DB::commit();
            return $price;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($price_id)
    {
        /** @var Price $price */
        $price = $this->repository
            ->find($price_id);
        if ($price === null) {
            throw (new ModelNotFoundException())->setModel(Price::class, [$price_id]);
        }

        $price
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($price);

        return true;
    }

    public function update($price_id, $request)
    {
        return DB::transaction(function () use ($price_id, $request) {
            $priceBeforeDelete = $this->repository->find($price_id);
            if ($priceBeforeDelete === null) {
                throw (new ModelNotFoundException())->setModel(Price::class, [$price_id]);
            }
            if (!isset($request['order']) && $priceBeforeDelete->order !== null) {
                $request['order'] = $priceBeforeDelete->order;
            }
            if (!isset($request['cityId'])) {
                $request['cityId'] = $priceBeforeDelete->cityId;
            }
            if (!isset($request['tripTypeId'])) {
                $request['tripTypeId'] = $priceBeforeDelete->tripTypeId;
            }
            $this->delete($price_id);
            return $this->store($request);
        });
    }

    public function findByCentral($central_id)
    {
        return $this->repository
            ->findByCentral($central_id);
    }

    public function updateOrder(int $cityId, array $orders): bool
    {
        return $this->repository->updateOrder($cityId, $orders);
    }
}
