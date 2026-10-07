<?php

namespace app\validator;

use app\exceptions\FavoriteDriverException;
use app\exceptions\RequestValidatorException;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2019
 * Time: 17:36
 */
class RefusedDriverValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateRefusedDriver($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);

        $this->customerIdIsValid($request->customerId ?? null);
        $this->driverIdIsValid($request->driverId ?? null);

        return true;
    }

    /**
     * @param $customerId
     * @throws Exception
     */
    private function customerIdIsValid($customerId)
    {
        if (!is_numeric($customerId))
            throw new FavoriteDriverException(1000);
    }

    /**
     * @param $driverId
     * @throws Exception
     */
    private function driverIdIsValid($driverId)
    {
        if (!is_numeric($driverId))
            throw new FavoriteDriverException(1001);
    }
}