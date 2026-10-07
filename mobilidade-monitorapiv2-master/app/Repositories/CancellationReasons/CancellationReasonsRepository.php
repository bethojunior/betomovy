<?php


namespace App\Repositories\CancellationReasons;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\CancellationReasons\CancellationReasons;

class CancellationReasonsRepository extends AbstractRepository
{
    /**
     * CancellationReasonsRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(CancellationReasons::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function all()
    {
        return $this->getModel()
            ::with("CancellationReasonsType")
            ->where('statusId',StatusConst::ACTIVE)
            ->get();
    }
}
