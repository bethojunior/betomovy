<?php

namespace App\Repositories\Price\Range;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Range\PriceRangeCentral;
use App\Models\Price\Range\PriceRangeWithCentral;
use Illuminate\Database\Eloquent\Builder;

class PriceRangeWithCentralRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(PriceRangeWithCentral::class);
    }
}
