<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 15:51
 */

namespace Cash\Repositories\BalanceTransfer;


use App\Contracts\Repository\AbstractRepository;
use Cash\Models\BalanceTransfer\CashPaymentForm;

class CashPaymentFormRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CashPaymentForm::class);
    }
}
