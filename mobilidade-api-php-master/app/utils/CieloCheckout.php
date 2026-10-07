<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use Cielo\API30\Ecommerce\CieloEcommerce;
use Cielo\API30\Ecommerce\CreditCard;
use Cielo\API30\Ecommerce\Environment;
use Cielo\API30\Ecommerce\Payment;
use Cielo\API30\Ecommerce\Request\CieloError;
use Cielo\API30\Ecommerce\Request\CieloRequestException;
use Cielo\API30\Ecommerce\Sale;
use Cielo\API30\Merchant;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/08/2019
 * Time: 08:54
 */
class CieloCheckout implements CheckoutInterface
{
    /**
     * @var Environment
     */
    private $environment;
    private $merchant;

    private $financialIntermediaryId = FinancialIntermediaryConst::CIELO;

    /**
     * Parametros alimentados pelo setParameters()
     */
    private $sale_id;
    private $value;
    private $description;

    private $card;

    public function __construct($merchant_id, $merchant_key)
    {
        $this->environment = env('ENV') == 'production' ?
            Environment::production() : Environment::sandbox();

        $this->merchant = new Merchant($merchant_id, $merchant_key);
    }

    /**
     * @return array
     * @throws CheckoutServiceException
     */
    public function creditPayment()
    {
        $sale = new Sale($this->sale_id ?? UUID::v4());
        $sale
            ->customer($this->card['cardholderName']);

        $creditCard = new CreditCard;
        $creditCard
            ->setCardNumber($this->card['number'])
            ->setSecurityCode($this->card['cvv'])
            ->setExpirationDate(
                $this->getCardExpirationDate()
            )
            ->setBrand(
                $this->identifyBrand($this->card['number'])
            )
            ->setHolder($this->card['cardholderName']);

        $payment = $sale->payment(
            round((float)$this->value, 2) * 100);

        $payment
            ->setType(Payment::PAYMENTTYPE_CREDITCARD)
            ->setCapture(true)
            ->setDemonstrative($this->description)
            ->setCreditCard($creditCard);

        try {
            $sale = (new CieloEcommerce($this->merchant, $this->environment))
                ->createSale($sale);

            $saleArray = $this->toArray($sale->jsonSerialize());

            $this->validateArrayResponse($saleArray);

            return $saleArray;

        } catch (CieloRequestException $e) {
            /** @var CieloError $cieloError */
            $cieloError = $e->getCieloError();

            throw new CheckoutServiceException(150, [
                $e->getMessage(),
                $cieloError ? $cieloError->getMessage() : null
            ]);
        }
    }

    /**
     * @throws CheckoutServiceException
     */
    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @return array
     * @throws CheckoutServiceException
     */
    public function refundCreditPayment($paymentId, $amount = null)
    {
        try {
            (new CieloEcommerce($this->merchant, $this->environment))
                ->cancelSale($paymentId);
        } catch (CieloRequestException $e) {
            $sale = null;
        }

        try {
            $sale = (new CieloEcommerce($this->merchant, $this->environment))
                ->getSale($paymentId);

            $saleArray = $this->toArray($sale->jsonSerialize());

            $this->validateArrayResponse($saleArray);

            return $saleArray;

        } catch (CieloRequestException $e) {
            /** @var CieloError $cieloError */
            $cieloError = $e->getCieloError();

            throw new CheckoutServiceException(150, [
                $e->getMessage(),
                $cieloError ? $cieloError->getMessage() : null
            ]);
        }
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @throws CheckoutServiceException
     */
    public function refundDebitPayment($paymentId, $amount = null)
    {
        throw new CheckoutServiceException(154);
    }

    public function findPayment($paymentId)
    {
        return null;
    }

    public function searchPayment(array $params)
    {
        return null;
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    public function insertCustomer($email, array $options = [])
    {
        return null;
    }

    public function insertCard($customerId, $data, $token = null)
    {
        return null;
    }

    public function setParameters(array $data): CheckoutInterface
    {
        // TODO: Implement setParameters() method.
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        return $this;
    }

    public function getCardExpirationDate()
    {
        return
            $this->card['expirationMonth'] .
            '/' .
            $this->card['expirationYear'];
    }

    private function toArray($data)
    {
        $newData = [];

        foreach ($data as $key => $value) {
            if (is_object($value) && method_exists($value, 'jsonSerialize')) {
                $newValue = $value->jsonSerialize();
                $newData += [$key => $this->toArray($newValue)];
                continue;
            }

            $newData += [$key => $value];
        }

        return $newData;
    }

    /**
     * @param array $payment
     * @throws CheckoutServiceException
     */
    private function validateArrayResponse(array $payment)
    {
        $status = $payment['payment']['status'] ?? null;

        if ($status === null || $status === 0) {
            throw new CheckoutServiceException(150, compact('payment'));
        }
    }

    /**
     * @param $cardNumber
     * @return string
     * @throws CheckoutServiceException
     */
    private function identifyBrand($cardNumber)
    {
        switch ($cardNumber) {
            case (bool)preg_match('/^(5067|4576|4011)/', $cardNumber) :
                return ucfirst('elo');

            case (bool)preg_match('/^(4)/', $cardNumber) :
                return ucfirst('visa');

            case (bool)preg_match('/^(50)/', $cardNumber) :
                return ucfirst('aura');

            case (bool)preg_match('/^(5)/', $cardNumber) :
                return ucfirst('master');

            case (bool)preg_match('/^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/', $cardNumber) :
                return ucfirst('master');

            case (bool)preg_match('/^(636368|438935|504175|451416|636297)/', $cardNumber) :
                return ucfirst('elo');

            case (bool)preg_match('/^(606282)/', $cardNumber) :
                return ucfirst('hipercard');

            case (bool)preg_match('/^(6011)/', $cardNumber) :
                return ucfirst('discover');

            case (bool)preg_match('/^(60)/', $cardNumber) :
                return ucfirst('hipercard');

            case (bool)preg_match('/^(3841)/', $cardNumber) :
                return ucfirst('hipercard');

            case (bool)preg_match('/^(622)/', $cardNumber) :
                return ucfirst('discover');

            case (bool)preg_match('/^(301|305)/', $cardNumber) :
                return ucfirst('diners');

            case (bool)preg_match('/^(34|37)/', $cardNumber) :
                return ucfirst('amex');

            case (bool)preg_match('/^(36|38)/', $cardNumber) :
                return ucfirst('diners');

            case (bool)preg_match('/^(64|65)/', $cardNumber) :
                return ucfirst('discover');

            case (bool)preg_match('/^(35)/', $cardNumber) :
                return ucfirst('jcb');

            default:
                throw new CheckoutServiceException(152, compact('cardNumber'));
        }
    }

    public function captureAmount($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }

    public function pixPayment(array $data)
    {
        throw new CheckoutServiceException(154);
    }

    public function findPaymentPix(string $paymentId)
    {
        return null;
    }

    public function refundPixPayment($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }

    public function reserveAmount()
    {
        return $this->creditPayment();
    }

    public function splitPayment($paymentId)
    {
        throw new CheckoutServiceException(157);
    }

    public function hasSplit(): bool
    {
        return false;
    }
}