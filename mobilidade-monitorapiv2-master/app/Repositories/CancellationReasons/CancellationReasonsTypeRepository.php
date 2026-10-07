<?php


namespace App\Repositories\CancellationReasons;


use App\Contracts\Repository\AbstractRepository;
use App\Models\CancellationReasons\CancellationReasonsType;

class CancellationReasonsTypeRepository extends AbstractRepository
{
    /**
     * CancellationReasonsTypeRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(CancellationReasonsType::class);
    }
}
