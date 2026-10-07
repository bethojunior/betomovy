<?php

namespace app\validator;

use app\exceptions\RequestValidatorException;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 17/01/2019
 * Time: 15:21
 */
class ChatTripValidator
{
    /**
     * @param $request
     * @throws RequestValidatorException
     */
    public function validateInsertMessage($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);

        $this->validateTripReference($request->tripReference ?? '');

        $this->validateUserId($request->userId ?? '');

        if (isset($request->message))
            $this->validateMessage($request->message ?? '');
    }

    /**
     * @param $tripReference
     * @throws RequestValidatorException
     */
    private function validateTripReference($tripReference)
    {
        if (strlen($tripReference) < 1)
            throw new RequestValidatorException(1250);
    }

    /**
     * @param $userID
     * @throws RequestValidatorException
     */
    private function validateUserId($userID)
    {
        if (strlen($userID) < 1)
            throw new RequestValidatorException(1251);
    }

    /**
     * @param $message
     * @throws RequestValidatorException
     */
    private function validateMessage($message)
    {
        if (strlen($message) < 1)
            throw new RequestValidatorException(1252);
    }
}