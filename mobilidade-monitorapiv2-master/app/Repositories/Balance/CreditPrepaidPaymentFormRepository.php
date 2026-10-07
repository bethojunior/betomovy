<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/05/2020
 * Time: 16:15
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\CreditPrepaidPaymentForm;

class CreditPrepaidPaymentFormRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CreditPrepaidPaymentForm::class);
    }

    public function deleteByCreditPrepaid($creditPrepaidId)
    {
        return $this->getModel()
            ::where('creditPrepaidId', $creditPrepaidId)
            ->delete();
    }
}
