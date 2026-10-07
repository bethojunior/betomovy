<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/10/2019
 * Time: 15:06
 */

namespace App\Services\Price\Range;


use App\Constants\StatusConst;
use App\Models\Price\Range\PriceRange;
use App\Repositories\Price\Range\PriceRangeRepository;

class PriceRangeService
{
    /**
     * @var PriceRangeRepository
     */
    private $repository;

    public function __construct(PriceRangeRepository $repository)
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
        $priceRange = new PriceRange($request);

        $this->repository
            ->save($priceRange);

        return $priceRange;
    }

    public function delete($id)
    {
        $priceRange = $this->repository
            ->find($id);

        $priceRange
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($priceRange);

        return true;
    }

    /**
     * @param $id
     * @param array $request
     * @return PriceRange
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
}
