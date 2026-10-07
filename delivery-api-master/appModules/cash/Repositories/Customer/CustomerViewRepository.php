<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 11:06
 */

namespace Cash\Repositories\Customer;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Customer\CustomerView;

class CustomerViewRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CustomerView::class);
    }

    public function findByContactNumberList(array $numbers)
    {
        $numbersInALine = implode(',', $numbers);

        return $this->getModel()
            ::whereRaw("clearPhone(phone) IN ({$numbersInALine})")
            ->whereNotNull('balanceId')
            ->get();
    }
}
