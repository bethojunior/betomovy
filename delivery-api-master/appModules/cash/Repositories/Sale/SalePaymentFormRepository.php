<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/02/2020
 * Time: 14:55
 */

namespace Cash\Repositories\Sale;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Sale\SalePaymentForm;

class SalePaymentFormRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(SalePaymentForm::class);
    }
}
