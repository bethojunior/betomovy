<?php

namespace app\validator\contracts;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/09/2019
 * Time: 10:38
 */
interface ICheckoutValidator
{
    public function validateTransactionResponse($status, $status_detail);
}