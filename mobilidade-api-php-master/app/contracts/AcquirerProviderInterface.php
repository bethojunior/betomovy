<?php

namespace app\contracts;

use app\model\Acquirer;

interface AcquirerProviderInterface
{
    public function getAcquirer(?int $cityId = null, ?int $paymentFormId = null): Acquirer;
}
