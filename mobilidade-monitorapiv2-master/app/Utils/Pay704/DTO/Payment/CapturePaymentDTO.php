<?php

namespace App\Utils\Pay704\DTO\Payment;

use App\Contracts\DTO\AbstractDTO;

class CapturePaymentDTO extends AbstractDTO
{
    public float $amount;

    public function __construct(float $amount)
    {
        $this->amount = $amount;
    }
}
