<?php

namespace app\services;

use app\dao\CentralCustomerDao;

class TripCustomerUserService
{
    public function resolveUserId($trip)
    {
        if (isset($trip->centralCustomerId)) {
            $centralCustomer = (new CentralCustomerDao())->findUserId($trip->centralCustomerId);
            if ($centralCustomer && $centralCustomer->userId) {
                return $centralCustomer->userId;
            }
        }

        return $trip->userId;
    }
}
