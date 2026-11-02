<?php

namespace app\validator;

use app\exceptions\CardValidatorException;
use app\exceptions\CheckoutCardException;
use DateTime;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/11/2018
 * Time: 15:57
 */
class CardValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsertCard($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new CardValidatorException(950);

        $hasToken = !empty($request->token) || !empty($request->stripeToken) || !empty($request->mpToken);

        if (!$hasToken) {
            $this->cardNumberIsValid($request->cardNumber ?? '');
            $this->cvvIsValid($request->cvv ?? '');
        } else {
            if (empty($request->cardNumber)) {
                $last4 = $request->lastFourDigits ?? '0000';
                $request->cardNumber = '424200000000' . $last4;
            }
            if (empty($request->cvv)) {
                $request->cvv = '000';
            }
            if (empty($request->firstSixDigits)) {
                $request->firstSixDigits = '424200';
            }
            if (empty($request->lastFourDigits)) {
                $request->lastFourDigits = substr((string)$request->cardNumber, -4);
            }
            if (empty($request->securityCodeLength)) {
                $request->securityCodeLength = 3;
            }
        }

        $this->expirationMonthIsValid($request->expirationMonth ?? '');
        $this->expirationYearIsValid($request->expirationYear ?? '');
        $this->cardholderNameIsValid($request->cardholderName ?? '');
        $this->holderDocumentIsValid($request->docNumber ?? '');
        $this->firstSixDigitsIsValid($request->firstSixDigits ?? '');
        $this->securityCodeLengthIsValid($request->securityCodeLength ?? '');
        $this->lastFourDigitsIsValid($request->lastFourDigits ?? '');
        if (!empty($request->birthDate)) {
            $this->validDateFormat($request->birthDate);
        }

        return true;
    }

    /**
     * @param $cardNumber
     * @throws Exception
     */
    private function cardNumberIsValid($cardNumber)
    {
        if (strlen($cardNumber) < 1)
            throw new CardValidatorException(951);
    }

    /**
     * @param $cvv
     * @throws Exception
     */
    private function cvvIsValid($cvv)
    {
        if (strlen($cvv) < 3)
            throw new CardValidatorException(952);
    }

    /**
     * @param $expirationMonth
     * @throws Exception
     */
    private function expirationMonthIsValid($expirationMonth)
    {
        if (strlen($expirationMonth) < 2 || strlen($expirationMonth) > 2 || (int)$expirationMonth > 12)
            throw new CardValidatorException(953, ['sended' => $expirationMonth]);
    }

    /**
     * @param $expirationYear
     * @throws Exception
     */
    private function expirationYearIsValid($expirationYear)
    {
        if (strlen($expirationYear) != 4)
            throw new CardValidatorException(954, ['sended' => $expirationYear]);
    }

    /**
     * @param $cardholderName
     * @throws Exception
     */
    private function cardholderNameIsValid($cardholderName)
    {
        if (strlen($cardholderName) < 2) {
            throw new CardValidatorException(955, ['sended' => $cardholderName]);
        }
    }

    /**
     * @param $cardTypeId
     * @throws Exception
     */
    private function cardTypeIdIsValid($cardTypeId)
    {
        if (!$cardTypeId)
            throw new CardValidatorException(957, ['sended' => $cardTypeId]);
    }

    /**
     * @param $cardFlagId
     * @throws Exception
     */
    private function cardFlagIdIsValid($cardFlagId)
    {
        if (!$cardFlagId)
            throw new CardValidatorException(958, ['sended' => $cardFlagId]);
    }

    /**
     * @param $docNumber
     * @throws Exception
     */
    private function holderDocumentIsValid($docNumber)
    {
        if (strlen($docNumber) < 11)
            throw new CardValidatorException(956, ['sended' => $docNumber]);
    }

    /**
     * @param $firstSixDigits
     * @throws Exception
     */
    private function firstSixDigitsIsValid($firstSixDigits)
    {
        if (strlen($firstSixDigits) < 6)
            throw new CardValidatorException(959, ['sended' => $firstSixDigits]);
    }

    /**
     * @param $paymentMethodName
     * @throws Exception
     */
    private function paymentMethodNameIsValid($paymentMethodName)
    {
        if (strlen($paymentMethodName) < 1)
            throw new CardValidatorException(960, ['sended' => $paymentMethodName]);
    }

    /**
     * @param $securityCodeLength
     * @throws Exception
     */
    private function securityCodeLengthIsValid($securityCodeLength)
    {
        if (strlen($securityCodeLength) < 1)
            throw new CardValidatorException(961, ['sended' => $securityCodeLength]);
    }

    /**
     * @param $lastFourDigits
     * @throws Exception
     */
    private function lastFourDigitsIsValid($lastFourDigits)
    {
        if (strlen($lastFourDigits) < 4)
            throw new CardValidatorException(962, ['sended' => $lastFourDigits]);
    }

    /**
     * @param $birthDate
     * @return void
     * @throws CheckoutCardException
     */
    private function validDateFormat($birthDate)
    {
        $dateFormat = DateTime::createFromFormat("Y-m-d", $birthDate);

        if (!$dateFormat)
            throw new CheckoutCardException(1195, ['sended' => $birthDate]);
    }
}