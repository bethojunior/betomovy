<?php

namespace app\validator;

use app\exceptions\FavoriteDriverException;
use app\exceptions\InvalidFieldEstablishmentException;
use Exception;
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/12/2018
 * Time: 17:58
 */
class FavoriteDriverValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateFavoriteDriver($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new InvalidFieldEstablishmentException("A requisição não pode ser vazia");

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