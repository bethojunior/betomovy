<?php

namespace App\Services\Price\Range;


use App\Constants\StatusConst;
use App\Models\Price\Range\PriceRangeCentral;
use App\Repositories\Price\Range\PriceRangeWithCentralRepository;

class PriceRangeWithCentralService
{
    /**
     * @var PriceRangeWithCentralRepository
     */
    private $repository;

    public function __construct(PriceRangeWithCentralRepository $repository)
    {
        $this->repository = $repository;
    }

}
