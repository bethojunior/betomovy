<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2019
 * Time: 09:16
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\DriverCommissionPaymentForm;

class DriverCommissionPaymentFormRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverCommissionPaymentForm::class);
    }

    public function findByDriverCommission($driverCommissionId)
    {
        return $this->getModel()
            ::where('driverCommissionId', $driverCommissionId)
            ->get();
    }
}
