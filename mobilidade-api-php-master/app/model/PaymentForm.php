<?php

namespace app\model;

use app\utils\BaseModel;

class PaymentForm extends BaseModel
{
    public const CREDIT_CARD = 1;
    public const OTHER_OPTIONS = 2;
    public const DEBIT_CARD = 3;
    public const PIX = 4;

    public const CIELO_PRODUCTION = 'production';
    public const CIELO_SANDBOX = 'sandbox';

    protected $idPaymentForm;
    protected $name;

    protected $table = 'paymentForm';

    public function getIdPaymentForm()
    {
        return $this->idPaymentForm;
    }

    public function setIdPaymentForm($idPaymentForm)
    {
        $this->idPaymentForm = $idPaymentForm;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }
}
