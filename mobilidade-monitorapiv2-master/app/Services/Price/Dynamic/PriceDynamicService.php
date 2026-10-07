<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 13:49
 */

namespace App\Services\Price\Dynamic;


use App\Constants\StatusConst;
use App\Models\Price\Dynamic\PriceDynamic;
use App\Repositories\Price\Dynamic\PriceDynamicRepository;

class PriceDynamicService
{
    /**
     * @var PriceDynamicRepository
     */
    private $repository;

    public function __construct(PriceDynamicRepository $repository)
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
        $result = collect();

        foreach ($request['dayOfWeek'] as $dayOfWeek) {
            $priceDynamic = new PriceDynamic($request);

            $priceDynamic
                ->dayOfWeek = $dayOfWeek;

            $this->repository
                ->save($priceDynamic);

            $result
                ->push($priceDynamic);
        }

        return $result;
    }

    public function enable($id)
    {
        /** @var PriceDynamic $priceDynamic */
        $priceDynamic = $this->repository
            ->find($id);

        $priceDynamic
            ->active = 1;

        $this->repository
            ->save($priceDynamic);

        return $priceDynamic;
    }

    public function disable($id)
    {
        /** @var PriceDynamic $priceDynamic */
        $priceDynamic = $this->repository
            ->find($id);

        $priceDynamic
            ->active = 0;

        $this->repository
            ->save($priceDynamic);

        return $priceDynamic;
    }

    public function show($id)
    {
        return $this->repository
            ->findById($id);
    }

    public function update($id, $request)
    {
        /** @var PriceDynamic $priceDynamic */
        $priceDynamic = $this->repository
            ->find($id);

        $priceDynamic
            ->fill($request);

        $this->repository
            ->save($priceDynamic);

        return $priceDynamic;
    }

    public function delete($id)
    {
        /** @var PriceDynamic $priceDynamic */
        $priceDynamic = $this->repository
            ->find($id);

        $priceDynamic
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($priceDynamic);

        return $priceDynamic;
    }
}
