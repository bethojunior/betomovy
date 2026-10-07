<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/05/2020
 * Time: 15:51
 */

namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryPaymentForm;

class DeliveryPaymentFormRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DeliveryPaymentForm::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::with('paymentFormType')
            ->get();
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'id',
                'name AS text'
            )
            ->get();
    }
}
