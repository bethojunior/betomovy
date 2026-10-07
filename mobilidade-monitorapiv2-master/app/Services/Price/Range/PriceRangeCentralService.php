<?php

namespace App\Services\Price\Range;


use App\Constants\StatusConst;
use App\Models\Price\Range\PriceRangeCentral;
use App\Repositories\Price\Range\PriceRangeCentralRepository;

class PriceRangeCentralService
{
    /**
     * @var PriceRangeCentralRepository
     */
    private $repository;

    public function __construct(PriceRangeCentralRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $queryRequest = [])
    {
        return $this->repository
            ->findAll($queryRequest);
    }

    public function insert($request)
    {
        try {
            \DB::beginTransaction();

            $priceRange = $this->repository->create([
                'min_value' => $request['min_value'],
                'max_value' => $request['max_value'],
                'new_value' => $request['new_value'],
                'tripTypeId' => $request['tripTypeId'],
                'cityId' => $request['cityId'] ?? null,
                'description' => $request['description'],
            ]);

            $this->attachCentral($priceRange, $request['centralId']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return $priceRange;
    }

    public function delete($id)
    {
        $priceRange = $this->repository
            ->find($id);

        $priceRange->statusId = StatusConst::REMOVED;
        $priceRange->save();

        $priceRange->centrals()->wherePivot('priceRangeCentralId', $priceRange->id)
            ->update([
                'priceRangeWithCentral.statusId' => StatusConst::REMOVED
            ]);

        return true;
    }

    /**
     * @param $id
     * @param array $request
     * @return PriceRangeCentral
     * @throws \Exception
     */
    public function update($id, array $request)
    {
        try {
            \DB::beginTransaction();

            $this->delete($id);

            $priceRange = $this->insert($request);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw  $e;
        }

        return $priceRange;
    }

    private function attachCentral($priceRange, $centralIds)
    {
        $centralIds = array_map('intval', $centralIds);

        foreach ($centralIds as $centralId) {
            $priceRange->centrals()->attach($centralId, [
                'priceRangeCentralId' => $priceRange->id
            ]);
        }
    }

}
