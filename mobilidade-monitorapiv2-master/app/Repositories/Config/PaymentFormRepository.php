<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/05/2020
 * Time: 15:40
 */

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\PaymentForm;

class PaymentFormRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(PaymentForm::class);
    }
}
