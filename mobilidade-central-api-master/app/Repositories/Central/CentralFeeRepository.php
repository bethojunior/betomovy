<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralFee;

class CentralFeeRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralFee::class);
    }

    public function findActive()
    {
        return $this->getModel()
            ::where('statusId',StatusConst::ACTIVE)
            ->first();
    }

}
