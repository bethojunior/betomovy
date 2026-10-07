<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/03/2020
 * Time: 14:46
 */

namespace Cash\Repositories\Sale;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Sale\SaleStatus;

class SaleStatusRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(SaleStatus::class);
    }

    public function findNameById($id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->pluck('name')
            ->first();
    }
}
