<?php

namespace App\Contracts\Checkout;

interface CheckoutInterface
{
    public function captureAmount($paymentId, ?float $amount = null): array;

    public function setParameters(array $data): CheckoutInterface;
}
