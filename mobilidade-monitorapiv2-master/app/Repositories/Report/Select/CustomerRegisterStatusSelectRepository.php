<?php


namespace App\Repositories\Report\Select;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Enum\CustomerRegisterStatus;

class CustomerRegisterStatusSelectRepository extends AbstractRepository
{
    /**
     * CustomerRegisterStatusSelectRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(CustomerRegisterStatus::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'idCustomerRegisterStatus AS id',
                'name AS text'
            )
            ->get();
    }
}
