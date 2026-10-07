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

class PriceService
{
    /**
     * @var PriceRepository
     */
    private $repository;

    public function __construct(PriceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store($request)
    {
        $price = new Price($request);

        $this->repository
            ->save($price);

        return $price;
    }

    public function delete($price_id)
    {
        /** @var Price $price */
        $price = $this->repository
            ->find($price_id);

        $price
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($price);

        return true;
    }

    public function update($price_id, $request)
    {
        $this->delete($price_id);

        return $this->store($request);
    }

    public function findByCentral($central_id)
    {
        return $this->repository
            ->findByCentral($central_id);
    }
}
